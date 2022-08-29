const cookieParser = require("cookie-parser");
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");

const { connectDB } = require("./models");
const MainRouter = require("./routes/index");
const { isDev } = require("./constants");

const main = async () => {
  dotenv.config({ path: path.join(__dirname, "../.env") });

  await connectDB();

  const FRONTEND_URL = isDev
    ? `http://localhost:${process.env.PORT}`
    : process.env.FRONTEND;

  const app = express();
  app.set("trust proxy", !isDev);

  app.use(cors({ origin: [FRONTEND_URL], credentials: true }));
  app.use(cookieParser());
  app.use(express.json());
  app.use("/", MainRouter);

  app.listen(process.env.PORT, () => {
    console.log(`Web-Server has started running on PORT-[${process.env.PORT}]`);
  });
};

main();
