const mongoose = require("mongoose");

const PDFSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  pdfName: {
    type: String,
    required: true,
  },
  images: [
    {
      filename: String,
      path: String,
    },
  ],
});

module.exports = mongoose.model("PDF", PDFSchema);
