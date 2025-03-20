const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Function to ensure directory exists
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Define directories
const directories = {
  uploads: "uploads",
  templates: "Templates",
  resumeUserPDF: "ResumeUserPDF",
};

// Create directories if they don’t exist
Object.values(directories).forEach(ensureDirectoryExists);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      if (!req?.user)
        return cb(new Error("Unauthorized: No user found in request"));

      if (!req.user?.role)
        return cb(new Error("Unauthorized: User role not specified"));

      let uploadDir;

      // Store PDFs separately
      if (file.mimetype === "application/pdf") {
        uploadDir = directories.resumeUserPDF;
      } else {
        // Determine upload directory based on user role
        uploadDir =
          req.user.role === "admin"
            ? directories.templates
            : directories.uploads;
      }

      cb(null, uploadDir);
    } catch (err) {
      cb(err);
    }
  },
  filename: function (req, file, cb) {
    try {
      if (!file?.originalname)
        return cb(new Error("Invalid file: File or filename missing"));

      const uniqueFilename = `${Date.now()}_${file.originalname}`;
      cb(null, uniqueFilename);
    } catch (err) {
      cb(err);
    }
  },
});

// File Filter (Accept only images and PDFs)
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image and PDF files are allowed!"), false);
  }
};

// Multer Middleware
const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
