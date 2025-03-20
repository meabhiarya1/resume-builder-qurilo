const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  savePDF,
  getUserPDFs,
  getUserPDFsForAdmin,
  getSinglePDF,
  getAdminTemplates,
  deletePDF,
  deleteTemplatePDF,
} = require("../controllers/pdfController");

const router = express.Router();
router.post(
  "/",
  protect,
  upload.fields([
    { name: "pdf", maxCount: 1 }, // Handle a single PDF file
    { name: "images", maxCount: 10 }, // Handle multiple images
  ]),
  savePDF
);

router.get("/", protect, getUserPDFs); // Get all PDFs for the logged-in user
router.get("/:id", protect, getUserPDFsForAdmin); // Get all PDFs for the for admin of selected user
router.get("/:id", protect, getSinglePDF); // Get a single PDF by ID
router.get("/admin/templates", protect, getAdminTemplates); // Get all PDFs from admin
router.delete("/template/:id", adminOnly, deleteTemplatePDF); // Delete a Template
router.delete("/:id", protect, deletePDF); // Delete a PDF

module.exports = router;
