const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token || !token.startsWith("Bearer "))
    return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

exports.adminOnly = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token || !token.startsWith("Bearer "))
    return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (req.user.role !== "admin") {
      return res.status(401).json({ message: "Not authorized" });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
