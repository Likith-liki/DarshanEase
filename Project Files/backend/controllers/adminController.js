// backend/controllers/adminController.js
const Booking = require("../models/Booking");
const Darshan = require("../models/Darshan");
const Temple = require("../models/Temple");
const User = require("../models/User");
const Organizer = require("../models/Organizer");

// ✅ Get dashboard stats (for admin)
const getDashboardStats = async (req, res) => {
  try {
    const [users, organizers, temples, darshans, bookings] = await Promise.all([
      User.countDocuments(),
      Organizer.countDocuments(),
      Temple.countDocuments(),
      Darshan.countDocuments(),
      Booking.countDocuments(),
    ]);
    res.json({ users, organizers, temples, darshans, bookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get organizer dashboard stats
const getOrganizerDashboardStats = async (req, res) => {
  try {
    const temple = await Temple.findOne({ organizer: req.user.id });
    if (!temple) {
      return res.json({ temples: 0, darshans: 0, bookings: 0 });
    }
    const [darshans, bookings] = await Promise.all([
      Darshan.countDocuments({ temple: temple._id }),
      Booking.countDocuments({ temple: temple._id }),
    ]);
    res.json({ temples: 1, darshans, bookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get comprehensive revenue stats
const getRevenueStats = async (req, res) => {
  try {
    const { period = "all" } = req.query;

    let dateFilter = {};
    const now = new Date();

    if (period === "today") {
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      dateFilter = {
        bookingDate: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      };
    } else if (period === "week") {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter = { bookingDate: { $gte: weekAgo } };
    } else if (period === "month") {
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateFilter = { bookingDate: { $gte: monthAgo } };
    } else if (period === "year") {
      const yearAgo = new Date(now);
      yearAgo.setFullYear(yearAgo.getFullYear() - 1);
      dateFilter = { bookingDate: { $gte: yearAgo } };
    }

    // Get all confirmed bookings
    const bookings = await Booking.find({
      ...dateFilter,
      status: "confirmed",
    })
      .populate("temple", "templeName")
      .populate("darshan", "darshanName");

    // Calculate total revenue
    let totalRevenue = 0;
    let totalBookings = bookings.length;
    let totalTickets = 0;
    let revenueByTicketType = {
      normal: 0,
      vip: 0,
    };
    let revenueByTemple = {};
    let revenueByDarshan = {};

    bookings.forEach((booking) => {
      totalRevenue += booking.totalAmount;
      totalTickets += booking.numberOfTickets;

      // By ticket type
      if (booking.ticketType === "normal") {
        revenueByTicketType.normal += booking.totalAmount;
      } else if (booking.ticketType === "vip") {
        revenueByTicketType.vip += booking.totalAmount;
      }

      // By temple
      const templeName = booking.temple?.templeName || "Unknown";
      if (!revenueByTemple[templeName]) {
        revenueByTemple[templeName] = {
          revenue: 0,
          bookings: 0,
          tickets: 0,
        };
      }
      revenueByTemple[templeName].revenue += booking.totalAmount;
      revenueByTemple[templeName].bookings += 1;
      revenueByTemple[templeName].tickets += booking.numberOfTickets;

      // By darshan
      const darshanName = booking.darshan?.darshanName || "Unknown";
      if (!revenueByDarshan[darshanName]) {
        revenueByDarshan[darshanName] = {
          revenue: 0,
          bookings: 0,
          tickets: 0,
        };
      }
      revenueByDarshan[darshanName].revenue += booking.totalAmount;
      revenueByDarshan[darshanName].bookings += 1;
      revenueByDarshan[darshanName].tickets += booking.numberOfTickets;
    });

    // Sort temple revenue
    const sortedTemples = Object.entries(revenueByTemple).sort(
      (a, b) => b[1].revenue - a[1].revenue,
    );
    const sortedDarshans = Object.entries(revenueByDarshan).sort(
      (a, b) => b[1].revenue - a[1].revenue,
    );

    // Get daily and monthly revenue
    const dailyRevenue = await getDailyRevenue();
    const monthlyRevenue = await getMonthlyRevenue();

    res.json({
      period,
      totalRevenue,
      totalBookings,
      totalTickets,
      averageBookingValue: totalBookings > 0 ? totalRevenue / totalBookings : 0,
      revenueByTicketType,
      topTemples: sortedTemples.slice(0, 5).map(([name, data]) => ({
        name,
        ...data,
      })),
      topDarshans: sortedDarshans.slice(0, 5).map(([name, data]) => ({
        name,
        ...data,
      })),
      dailyRevenue,
      monthlyRevenue,
    });
  } catch (error) {
    console.error("Revenue stats error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Helper: Get daily revenue for last 7 days
const getDailyRevenue = async () => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const result = await Booking.aggregate([
      {
        $match: {
          bookingDate: { $gte: sevenDaysAgo },
          status: "confirmed",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$bookingDate" },
            month: { $month: "$bookingDate" },
            day: { $dayOfMonth: "$bookingDate" },
          },
          total: { $sum: "$totalAmount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    return result.map((item) => ({
      date: `${item._id.year}-${String(item._id.month).padStart(2, "0")}-${String(item._id.day).padStart(2, "0")}`,
      revenue: item.total,
      bookings: item.count,
    }));
  } catch (error) {
    console.error("Daily revenue error:", error);
    return [];
  }
};

// ✅ Helper: Get monthly revenue for last 12 months
const getMonthlyRevenue = async () => {
  try {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const result = await Booking.aggregate([
      {
        $match: {
          bookingDate: { $gte: twelveMonthsAgo },
          status: "confirmed",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$bookingDate" },
            month: { $month: "$bookingDate" },
          },
          total: { $sum: "$totalAmount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    return result.map((item) => ({
      month: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
      revenue: item.total,
      bookings: item.count,
    }));
  } catch (error) {
    console.error("Monthly revenue error:", error);
    return [];
  }
};

// ✅ Get organizer revenue stats (for specific temple)
const getOrganizerRevenueStats = async (req, res) => {
  try {
    // Find temple managed by this organizer
    const temple = await Temple.findOne({ organizer: req.user.id });
    if (!temple) {
      return res.json({ message: "No temple assigned", totalRevenue: 0 });
    }

    const bookings = await Booking.find({
      temple: temple._id,
      status: "confirmed",
    });

    let totalRevenue = 0;
    let totalBookings = bookings.length;
    let totalTickets = 0;
    let revenueByTicketType = { normal: 0, vip: 0 };

    bookings.forEach((booking) => {
      totalRevenue += booking.totalAmount;
      totalTickets += booking.numberOfTickets;
      if (booking.ticketType === "normal") {
        revenueByTicketType.normal += booking.totalAmount;
      } else {
        revenueByTicketType.vip += booking.totalAmount;
      }
    });

    res.json({
      templeName: temple.templeName,
      totalRevenue,
      totalBookings,
      totalTickets,
      averageBookingValue: totalBookings > 0 ? totalRevenue / totalBookings : 0,
      revenueByTicketType,
    });
  } catch (error) {
    console.error("Organizer revenue error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ EXPORT ALL FUNCTIONS
module.exports = {
  getDashboardStats,
  getOrganizerDashboardStats,
  getRevenueStats,
  getOrganizerRevenueStats,
};
