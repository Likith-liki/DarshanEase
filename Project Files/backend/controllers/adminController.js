const User = require("../models/User");
const Organizer = require("../models/Organizer");
const Temple = require("../models/Temple");
const Darshan = require("../models/Darshan");
const Booking = require("../models/Booking");

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

// Organizer dashboard stats (scoped to own temple)
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

module.exports = { getDashboardStats, getOrganizerDashboardStats };
