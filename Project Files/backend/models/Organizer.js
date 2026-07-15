const mongoose = require("mongoose");

const OrganizerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: { type: String, default: "organizer" },
    temple: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Temple",
      default: null,
    },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Organizer", OrganizerSchema);
