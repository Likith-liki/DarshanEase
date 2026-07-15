const mongoose = require("mongoose");

const TempleSchema = new mongoose.Schema(
  {
    templeName: { type: String, required: true },
    location: { type: String, required: true },
    darshanStartTime: { type: String, required: true },
    darshanEndTime: { type: String, required: true },
    description: { type: String },
    image: { type: String, default: "" },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "Organizer" },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Temple", TempleSchema);
