const mongoose = require("mongoose");

const mensajeSchema = new mongoose.Schema(
  {
    conversacion: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
    emisor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    texto: { type: String, required: true, trim: true },
    leidoPor: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", mensajeSchema);