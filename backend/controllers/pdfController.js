const PDF = require("../models/PDF");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");

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

// 📂 Get all PDFs for the for admin of selected user
exports.getUserPDFsForAdmin = async (req, res) => {
  try {
    const pdfs = await PDF.find({ userId: req.params.id });
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

    // Loop through and delete all associated images
    if (pdf.images && pdf.images.length > 0) {
      pdf.images.forEach((image) => {
        const imagePath = path.join(
          __dirname,
          "..",
          image.path.replace(/\\/g, "/")
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath); // Delete image file
          console.log(`Deleted image: ${imagePath}`);
        } else {
          console.log(`Image not found: ${imagePath}`);
        }
      });
    }

    // Delete PDF document from MongoDB
    await pdf.deleteOne();

    res.json({ message: "PDF and associated images deleted successfully!" });
  } catch (error) {
    console.error("Error deleting PDF and images:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ❌ Delete a Template
exports.deleteTemplatePDF = async (req, res) => {
  try {
    const pdf = await PDF.findById(req.params.id);
    if (!pdf) return res.status(404).json({ message: "PDF not found" });

    // Loop through and delete all associated images
    if (pdf.images && pdf.images.length > 0) {
      pdf.images.forEach((image) => {
        const imagePath = path.join(
          __dirname,
          "..",
          image.path.replace(/\\/g, "/")
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath); // Delete image file
          console.log(`Deleted image: ${imagePath}`);
        } else {
          console.log(`Image not found: ${imagePath}`);
        }
      });
    }

    // Delete PDF document from MongoDB
    await pdf.deleteOne();

    res.json({ message: "PDF and associated images deleted successfully!" });
  } catch (error) {
    console.error("Error deleting PDF and images:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📂 Get all PDFs from admin
exports.getAdminTemplates = async (req, res) => {

  try {
    // Step 1: Find the first admin user
    const adminUser = await User.findOne({ role: "admin" });

    if (!adminUser) {
      return res.status(404).json({ message: "No admin user found." });
    }

    // Step 2: Fetch all PDFs where the admin ID matches
    const adminPDFs = await PDF.find({ userId: adminUser._id });

    if (adminPDFs.length === 0) {
      return res.status(404).json({ message: "No PDFs found for this admin." });
    }

    // Step 3: Send the PDFs in the response
    return res.status(200).json({
      admin: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
      },
      templates: adminPDFs,
    });
  } catch (error) {
    console.error("Error fetching admin templates:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
