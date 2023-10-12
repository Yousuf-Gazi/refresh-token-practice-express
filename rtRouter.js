const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { addDays } = require("date-fns");
const RefreshToken = require("./RefreshToken");

router.post("/refresh", async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, "JWT_STRONG_SECRET");
    const oldRefreshToken = await RefreshToken.findById(decoded._id);

    if (!oldRefreshToken || !oldRefreshToken.isActive) {
      return res.status(400).json({
        message: "Invalid token",
      });
    }

    oldRefreshToken.revokedAt = new Date();
    oldRefreshToken.revokedIp = req.clientIp;
    await oldRefreshToken.save();

    const refreshToken = new RefreshToken({
      user: decoded.user,
      issuedIp: req.clientIp,
      token: "",
      expiredAt: addDays(new Date(), 30),
    });

    const rToken = jwt.sign(
      {
        _id: refreshToken._id,
        user: decoded.user,
        name: decoded.name,
        email: decoded.email,
      },
      "JWT_STRONG_SECRET"
    );

    refreshToken.token = rToken;
    await refreshToken.save();

    const accessToken = jwt.sign(
      {
        _id: decoded.user,
        name: decoded.name,
        email: decoded.email,
      },
      "JWT_STRONG_SECRET",
      {
        expiresIn: "30s",
      }
    );

    res.status(200).json({
      accessaToken: accessToken,
      refreshToken: rToken,
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid token",
    });
  }
});

router.post("/revoke", async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, "JWT_STRONG_SECRET");
    const refreshToken = await RefreshToken.findById(decoded._id);

    if (!refreshToken || !refreshToken.isActive) {
      return res.status(400).json({
        message: "Invalid token",
      });
    }

    refreshToken.revokedAt = new Date();
    refreshToken.revokedIp = req.clientIp;
    await refreshToken.save();

    res.status(200).json({
      message: "Token revoked",
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid token",
    });
  }
});

router.post("/valid", async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, "JWT_STRONG_SECRET");
    const refreshToken = await RefreshToken.findById(decoded._id);

    if (!refreshToken || !refreshToken.isActive) {
      return res.status(400).json({
        message: "Invalid token",
      });
    }

    res.status(200).json({
      message: "Token valid",
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid token",
    });
  }
});

module.exports = router;
