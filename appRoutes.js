const router = require("express").Router();
const authMiddleware = require("./authMiddleware");
const authorize = require("./authorize");
// const passport = require("passport");

router.get("/public", authMiddleware, authorize(["admin","user"]), (req, res) => {
  res.status(200).json({
    message: "I am Public route",
  });
});
// Implemented Passport.js for Authentication
// router.get(
//   "/protected",
//   passport.authenticate("bearer", { session: false }),
//   (req, res) => {
//     res.status(200).json({
//       message: "I am Protected route",
//       user: req.user,
//     });
//   }
// );
router.get("/protected", authMiddleware, authorize(["admin"]), (req, res) => {
  res.status(200).json({
    message: "I am Protected route",
    user: req.user,
  });
});

module.exports = router;
