const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  savePDF,
  getUserPDFs,
  getUserPDFsForAdmin,
  getSinglePDF,
  deletePDF,
} = require("../controllers/pdfController");

const router = express.Router();

router.post("/", protect, upload.array("images"), savePDF); // Save a new PDF
router.get("/", protect, getUserPDFs); // Get all PDFs for the logged-in user
router.get("/:id", protect, getUserPDFsForAdmin); // Get all PDFs for the for admin of selected user
router.get("/:id", protect, getSinglePDF); // Get a single PDF by ID
router.delete("/:id", protect, deletePDF); // Delete a PDF

module.exports = router;
