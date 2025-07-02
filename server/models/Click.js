const mongoose = require("mongoose");

const clickSchema = new mongoose.Schema(
  {
    shortCode: {
      type: String,
      required: true,
    },
    deviceType: {
      type: String,
    },
    location: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Click", clickSchema);
