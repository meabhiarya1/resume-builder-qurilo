const PDF = require("../models/PDF");

// 📝 Save PDF and extracted images
exports.savePDF = async (req, res) => {
  try {
    // Extract pdfName from the request body
    const pdfName = req.body.pdfName;
    if (!pdfName) {
      return res.status(400).json({ message: "pdfName is required" });
    }

    // Extract images from request
    const images = req.files.map((file) => ({
      filename: file.filename,
      path: file.path,
    }));

    // Save PDF data in the database
    const newPDF = new PDF({
      userId: req.user._id,
      pdfName,
      images,
    });

    await newPDF.save();
    res.status(201).json({ message: "PDF saved successfully!", pdf: newPDF });
  } catch (error) {
    console.error("Error saving PDF:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// 📂 Get all PDFs for a user
exports.getUserPDFs = async (req, res) => {
  try {
    const pdfs = await PDF.find({ userId: req.user._id });
    res.json(pdfs);
  } catch (error) {
    console.error("Error fetching PDFs:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📄 Get a single PDF by ID
exports.getSinglePDF = async (req, res) => {
  try {
    const pdf = await PDF.findById(req.params.id);
    if (!pdf) return res.status(404).json({ message: "PDF not found" });

    res.json(pdf);
  } catch (error) {
    console.error("Error fetching PDF:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ❌ Delete a PDF
exports.deletePDF = async (req, res) => {
  try {
    const pdf = await PDF.findById(req.params.id);
    if (!pdf) return res.status(404).json({ message: "PDF not found" });

    await pdf.deleteOne();
    res.json({ message: "PDF deleted successfully!" });
  } catch (error) {
    console.error("Error deleting PDF:", error);
    res.status(500).json({ message: "Server error" });
  }
};
