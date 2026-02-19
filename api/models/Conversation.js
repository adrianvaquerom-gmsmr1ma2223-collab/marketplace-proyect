const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({

  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },

}, { timestamps: true });

module.exports = mongoose.model("Conversation", conversationSchema);