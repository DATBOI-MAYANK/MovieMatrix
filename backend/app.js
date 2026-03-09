import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json({ limit: "70mb" }));
app.use(express.urlencoded({ limit: "50kb", extended: true }));
app.use(cookieParser());

import userRouter from "./Routes/user.routes.js";

app.use("/users", userRouter);

import errorHandler from "./middlewares/errorHandler.middleware.js";
app.use(errorHandler);

export { app };
