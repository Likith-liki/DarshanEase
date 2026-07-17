// backend/controllers/bookingController.js
const Booking = require("../models/Booking");
const Darshan = require("../models/Darshan");
const Temple = require("../models/Temple");
const QRCode = require("qrcode");

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { darshanId, ticketType, numberOfTickets } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!darshanId || !ticketType || !numberOfTickets) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    // Check if darshan exists
    const darshan = await Darshan.findById(darshanId);
    if (!darshan) {
      return res.status(404).json({ message: "Darshan not found" });
    }

    // Check availability
    if (darshan.availableSeats < numberOfTickets) {
      return res.status(400).json({
        message: `Only ${darshan.availableSeats} seats available`,
      });
    }

    // Calculate total amount
    const price = ticketType === "vip" ? darshan.vipPrice : darshan.normalPrice;
    const totalAmount = price * numberOfTickets;

    // Create booking
    const booking = await Booking.create({
      user: userId,
      darshan: darshanId,
      temple: darshan.temple,
      bookingDate: new Date(),
      ticketType,
      numberOfTickets,
      totalAmount,
      status: "confirmed",
    });

    // Update available seats
    darshan.availableSeats -= numberOfTickets;
    await darshan.save();

    // Generate QR Code
    const qrCodeData = JSON.stringify({
      bookingId: booking._id,
      temple: darshan.temple,
      darshan: darshan.darshanName,
      date: booking.bookingDate,
      ticketType,
      numberOfTickets,
    });
    const qrCode = await QRCode.toDataURL(qrCodeData);

    // Populate booking details
    const populatedBooking = await Booking.findById(booking._id)
      .populate("user", "name email phone")
      .populate("darshan", "darshanName startTime endTime")
      .populate("temple", "templeName location image");

    res.status(201).json({
      ...populatedBooking.toObject(),
      qrCode,
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get user's bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("darshan", "darshanName startTime endTime normalPrice vipPrice")
      .populate("temple", "templeName location image")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking already cancelled" });
    }

    // Update booking status
    booking.status = "cancelled";
    await booking.save();

    // Add seats back to darshan
    const darshan = await Darshan.findById(booking.darshan);
    if (darshan) {
      darshan.availableSeats += booking.numberOfTickets;
      await darshan.save();
    }

    res.json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get organizer bookings
const getOrganizerBookings = async (req, res) => {
  try {
    // First find the temple managed by this organizer
    const temple = await Temple.findOne({ organizer: req.user.id });
    if (!temple) {
      return res.json([]);
    }

    const bookings = await Booking.find({ temple: temple._id })
      .populate("user", "name email phone")
      .populate("darshan", "darshanName startTime endTime")
      .populate("temple", "templeName location")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bookings (admin)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email phone")
      .populate("darshan", "darshanName startTime endTime")
      .populate("temple", "templeName location")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
  getOrganizerBookings,
  getAllBookings,
};
