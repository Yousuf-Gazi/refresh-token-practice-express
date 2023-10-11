const jwt = require("jsonwebtoken");
const passport = require("passport");
const BearerStrategy = require("passport-http-bearer").Strategy;
const User = require("./User");

passport.use(
  new BearerStrategy(async (token, done) => {
    try {
      const decoded = jwt.verify(token, "JWT_STRONG_SECRET");
      const user = await User.findById(decoded._id).select("-password");

      if (!user) {
        return done(null, false), { message: "User not found" };
      }
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);
