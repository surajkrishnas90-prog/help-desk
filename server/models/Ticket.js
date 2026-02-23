const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({

  title: String,
  description: String,

  status: {
    type: String,
    default: "Open"
  },

  priority: String,

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, { timestamps: true });

module.exports = mongoose.model("Ticket", ticketSchema);