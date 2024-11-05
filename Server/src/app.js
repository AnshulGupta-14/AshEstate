import express from "express";
import cors from "cors";
import userRouter from "./Routes/user.routes.js";
import authRouter from "./Routes/auth.routes.js";
import listingRouter from "./Routes/listing.routes.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use('/api/listings', listingRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

export { app };
