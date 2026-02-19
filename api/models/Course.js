const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({

  title: { type: String, required: true },

  description: String,

  price: { type: Number, default: 0 },

  imageUrl: String,
  imagePublicId: String,

  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },

  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "draft",
  },

}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);