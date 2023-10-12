const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { addDays } = require("date-fns");
const RefreshToken = require("./RefreshToken");
const User = require("./User");

const checkIfUserExist = async (email) => {
  return await User.findOne({ email });
};

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExist = await checkIfUserExist(email);
    if (userExist) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({
      message: "Server error!",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await checkIfUserExist(email);
    if (!userExist) {
      return res.status(400).json({
        message: "User does not exist",
      });
    }

    const correctPassword = await bcrypt.compare(password, userExist.password);
    if (!correctPassword) {
      return res.status(400).json({
        message: "Password is incorrect",
      });
    }

    const token = jwt.sign(
      {
        _id: userExist._id,
        name: userExist.name,
        email: userExist.email,
      },
      "JWT_STRONG_SECRET",
      {
        expiresIn: "30s",
      }
    );

    const refreshToken = new RefreshToken({
      user: userExist._id,
      issuedIp: req.clientIp || "N/A",
      token: "",
      expiredAt: addDays(new Date(), 30),
    });

    const rToken = jwt.sign(
      {
        _id: refreshToken._id,
        user: userExist._id,
        name: userExist.name,
        email: userExist.email,
      },
      "JWT_STRONG_SECRET"
    );

    refreshToken.token = rToken;
    await refreshToken.save();

    res.status(200).json({
      message: "Logged in and everything is okay",
      accessToken: token,
      refreshToken: rToken,
    });
  } catch {
    res.status(500).json({
      message: "Server error!",
    });
  }
});

module.exports = router;
