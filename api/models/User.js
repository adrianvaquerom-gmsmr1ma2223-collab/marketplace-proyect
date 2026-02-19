const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  type: {
    type: String,
    enum: ["verify_email", "reset_password"],
    required: true,
  },

  token: {
    type: String,
    required: true,
    unique: true,
  },

  expiresAt: {
    type: Date,
    required: true,
  },

  usedAt: Date,

}, { timestamps: true });

tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Token", tokenSchema);