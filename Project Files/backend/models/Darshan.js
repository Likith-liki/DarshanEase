const mongoose = require("mongoose");

const DarshanSchema = new mongoose.Schema(
  {
    darshanName: { type: String, required: true },
    temple: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Temple",
      required: true,
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    normalPrice: { type: Number, default: 0 },
    vipPrice: { type: Number, default: 0 },
    description: { type: String },
    availableSeats: { type: Number, default: 100 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Darshan", DarshanSchema);
