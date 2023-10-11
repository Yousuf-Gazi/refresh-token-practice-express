const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("./authMiddlewarePs");

const app = express();
app.use([cors(), morgan("dev"), express.json()]);

app.use("/auth", require("./authRoutes"));
app.use("/", require("./appRoutes"));

app.use("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Database connection
const DBUrl = "mongodb://127.0.0.1:27017/api-security";

mongoose.connect(DBUrl).then(() => {
  console.log("connected to db");
  app.listen(3000, () => {
    console.log("listening on port 3000");
  });
});
