import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import designerRoutes from "./routes/designerRoutes.js";
import designRoutes from "./routes/designRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import appointmentsRoutes from "./routes/appointmentsRoute.js";
import clientRoutes from "./routes/clientRoutes.js";
import connectDB from "./config/db.js";

dotenv.config();

const requiredEnv = ["MONGODB_URI", "JWT_SECRET"];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length) {
  console.error(`Missing required environment variables: ${missingEnv.join(", ")}`);
  process.exit(1);
}

await connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  app.set("trust proxy", 1);
}

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(morgan(isProduction ? "combined" : "dev"));

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX || 300),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later" },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.AUTH_RATE_LIMIT_MAX || 40),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many auth attempts, please try again later" },
});

app.use("/api", apiLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

app.get("/api/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const healthy = dbState === 1;
  res.status(healthy ? 200 : 503).json({
    status: healthy ? "ok" : "degraded",
    db: healthy ? "connected" : "disconnected",
    uptime: process.uptime(),
  });
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/designer", designerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/designers", designerRoutes);
app.use("/api/designs", designRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/settings", settingsRoutes);

app.use("/api/{*path}", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

const clientBuildPath = path.resolve(__dirname, "../frontend/build");
const serveClient = process.env.SERVE_CLIENT !== "false" && fs.existsSync(path.join(clientBuildPath, "index.html"));

if (serveClient) {
  app.use(express.static(clientBuildPath));
  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

app.use((err, req, res, next) => {
  if (err?.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "CORS blocked" });
  }
  console.error(err);
  res.status(err.status || 500).json({
    error: isProduction ? "Server error" : err.message,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (${process.env.NODE_ENV || "development"})`);
  if (serveClient) {
    console.log(`Serving frontend from ${clientBuildPath}`);
  }
});
