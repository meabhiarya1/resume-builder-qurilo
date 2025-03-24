const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const pdfRoutes = require("./routes/pdfRoutes");
const path = require("path");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "dist")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/templates", express.static(path.join(__dirname, "Templates")));
app.use("/pdf", express.static(path.join(__dirname, "ResumeUserPDF")));

app.use("/api/auth", authRoutes);
app.use("/api/pdfs", pdfRoutes);

// All other routes serve the frontend app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
