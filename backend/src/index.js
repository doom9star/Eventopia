const cookieParser = require("cookie-parser");
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");

const { connectDB } = require("./models");
const MainRouter = require("./routes/index");
const { isDev } = require("./constants");

const main = async () => {
  dotenv.config({ path: path.join(__dirname, "../.env") });

  await connectDB();

  const app = express();
  app.set("trust proxy", !isDev);

  app.use(
    cors({
      origin: "http://localhost:5500",
      credentials: true,
    })
  );
  app.use(morgan("dev"));
  app.use(cookieParser());
  app.use(express.json({ limit: "50mb" }));
  app.use("/", MainRouter);

  app.listen(process.env.PORT, () => {
    console.log(
      `Web-Server has started running on PORT-[${process.env.PORT}]\n`
    );
  });
};

main();
