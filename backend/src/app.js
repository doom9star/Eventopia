const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const MainRouter = require("./routes/index");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND,
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use("/", MainRouter);

module.exports = app;
