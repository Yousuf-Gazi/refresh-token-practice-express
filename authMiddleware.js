const jwt = require("jsonwebtoken");
const User = require("./User");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "No token, Auth failed!",
      });
    }
    const decoded = jwt.verify(token, "JWT_STRONG_SECRET");
    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid Token, Auth failed!",
    });
  }
};

module.exports = authenticate;