
const mongoose = require("mongoose");

const emergencyHistorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: "Completed"
  }
}, { timestamps: true });

module.exports = mongoose.model(
  "EmergencyHistory",
  emergencyHistorySchema
);
