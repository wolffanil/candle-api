const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");

const AppError = require("./utils/AppError");
const globalError = require("./config/ErrorConfig");

const authRouter = require("./auth/auth.routes");
const candleRouter = require("./candle/candle.routes");

dotenv.config();
const app = express();

app.enable("trust proxy");

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

app.use(helmet());

app.use(express.json({ limit: "10kb" }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(mongoSanitize());

app.use(compression());

app.get("/favicon.ico", (req, res) => {
  res.status(204);
});

app.get("/", (req, res) => {
  res.send("hello from server");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/candles", candleRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can dont use this ${req.originalUrl}`, 404));
});

app.use(globalError);

module.exports = app;
