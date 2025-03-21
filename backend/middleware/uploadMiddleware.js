const multer = require("multer");
const path = require("path");
const fs = require("fs");

const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const directories = {
  uploads: "uploads",
  templates: "Templates",
  resumeUserPDF: "ResumeUserPDF",
};

Object.values(directories).forEach(ensureDirectoryExists);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      if (!req?.user)
        return cb(new Error("Unauthorized: No user found in request"));

      if (!req.user?.role)
        return cb(new Error("Unauthorized: User role not specified"));

      let uploadDir;

      if (file.mimetype === "application/pdf") {
        uploadDir = directories.resumeUserPDF;
      } else {
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

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
