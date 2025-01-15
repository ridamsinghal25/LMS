import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./database/db.js";

import healthRoute from "./routes/health.route.js";
import userRoute from "./routes/user.route.js";

dotenv.config({ path: "./.env" });

// Connect to database
await connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Global Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  message: "Too many requests from this IP, please try again",
});

// Security Middleware
app.use(helmet());
// app.use(mongoSanitize());
app.use(hpp());
app.use("/api", limiter);

// Logging Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body Parser Middleware
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.stack || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Cors configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "device-remember-token",
      "Access-Control-Allow-Origin",
      "Origin",
      "Accept",
    ],
  })
);

// API Routes
app.use("/health", healthRoute);
app.use("/api/v1/user", userRoute);

// It should be always at the bottom
// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found !!",
  });
});

app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`
  );
});
