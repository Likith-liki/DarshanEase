const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    darshan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Darshan",
      required: true,
    },
    temple: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Temple",
      required: true,
    },
    bookingDate: { type: Date, required: true },
    ticketType: { type: String, enum: ["normal", "vip"], default: "normal" },
    numberOfTickets: { type: Number, default: 1 },
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "confirmed" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Booking", BookingSchema);
