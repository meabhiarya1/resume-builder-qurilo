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
    { name: "pdf", maxCount: 1 }, 
    { name: "images", maxCount: 10 },
  ]),
  savePDF
);

router.get("/", protect, getUserPDFs); 
router.get("/:id", protect, getUserPDFsForAdmin); 
router.get("/:id", protect, getSinglePDF); 
router.get("/admin/templates", protect, getAdminTemplates); 
router.delete("/template/:id", adminOnly, deleteTemplatePDF); 
router.delete("/:id", protect, deletePDF); 

module.exports = router;
