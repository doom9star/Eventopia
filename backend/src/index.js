const cookieParser = require("cookie-parser");
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");

const { connectDB } = require("./models");
const MainRouter = require("./routes/index");

dotenv.config({ path: path.join(__dirname, "../.env") });
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

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`server has started running!`);
  });
});

module.exports = app;
