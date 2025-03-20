const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadResDir = "uploads";
if (!fs.existsSync(uploadResDir)) {
  fs.mkdirSync(uploadResDir, { recursive: true });
}

const templateUploadDir = "Templates";
if (!fs.existsSync(templateUploadDir)) {
  fs.mkdirSync(templateUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      if (!req.user) {
        return cb(new Error("Unauthorized: No user found in request"), null);
      }

      if (!req.user.role) {
        return cb(new Error("Unauthorized: User role not specified"), null);
      }

      // Determine upload directory based on user role
      const uploadDir =
        req.user.role === "admin" ? templateUploadDir : uploadResDir;

      if (!uploadDir) {
        return cb(new Error("Upload directory is undefined"), null);
      }

      cb(null, uploadDir);
    } catch (err) {
      cb(err, null);
    }
  },
  filename: function (req, file, cb) {
    try {
      if (!file || !file.originalname) {
        return cb(new Error("Invalid file: File or filename missing"), null);
      }

      const uniqueFilename = `${Date.now()}${path.extname(file.originalname)}`;
      cb(null, uniqueFilename);
    } catch (err) {
      cb(err, null);
    }
  },
});

// File Filter (Accept only images)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Multer Middleware
const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
