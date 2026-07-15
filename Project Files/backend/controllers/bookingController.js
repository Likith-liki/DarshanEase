const QRCode = require("qrcode");
const Booking = require("../models/Booking");
const Darshan = require("../models/Darshan");

const createBooking = async (req, res) => {
  try {
    const { darshanId, bookingDate, ticketType, numberOfTickets } = req.body;
    const darshan = await Darshan.findById(darshanId).populate("temple");
    if (!darshan) return res.status(404).json({ message: "Darshan not found" });

    const qty = Number(numberOfTickets) || 1;
    const price = ticketType === "vip" ? darshan.vipPrice : darshan.normalPrice;
    const totalAmount = (price || 0) * qty;

    const booking = await Booking.create({
      user: req.user.id,
      darshan: darshan._id,
      temple: darshan.temple._id,
      bookingDate,
      ticketType: ticketType || "normal",
      numberOfTickets: qty,
      totalAmount,
    });

    const qrPayload = JSON.stringify({
      bookingId: booking._id,
      darshan: darshan.darshanName,
    });
    booking.qrCode = await QRCode.toDataURL(qrPayload);
    await booking.save();

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id })
    .populate("darshan")
    .populate("temple")
    .sort({ createdAt: -1 });
  res.json(bookings);
};

const cancelBooking = async (req, res) => {
  const booking = await Booking.findOne({
    _id: req.params.id,
    user: req.user.id,
  });
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  booking.status = "cancelled";
  await booking.save();
  res.json(booking);
};

// Organizer: bookings for own temple
const getOrganizerBookings = async (req, res) => {
  const Temple = require("../models/Temple");
  const temple = await Temple.findOne({ organizer: req.user.id });
  if (!temple) return res.json([]);
  const bookings = await Booking.find({ temple: temple._id })
    .populate("darshan")
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  res.json(bookings);
};

// Admin: all bookings
const getAllBookings = async (req, res) => {
  const bookings = await Booking.find()
    .populate("darshan")
    .populate("temple")
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  res.json(bookings);
};

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
  getOrganizerBookings,
  getAllBookings,
};
