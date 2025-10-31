// FRAMEWORK & EXTERNAL DEPENDENCIES IMPORTS
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { db } from "@src/database/_index/index";

// INTERNAL IMPORTS
import authRoutes from "@src/modules/auth/routes/_index";
import schoolInfoRoutes from "@src/modules/school-info/routes/_index";
import indexRoute from "@src/modules/_root/routes/_index";

import { middlewares } from "@src/middleware/_index";

// INITIALIZE APPLICATION RELATED SERVICES
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

db.connectDB();
//================================================================

// MIDDLEWARES
// ==============================================

// ASSIGN REQUEST MIDDLEWARES
const whitelist = { origin: process.env.CLIENT_ORIGIN_DEV, credentials: true };
app.use(cors(whitelist));
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));

// ASSIGN ROUTES MIDDLWARES
app.use("/", indexRoute);
app.use("/api/auth", authRoutes);
app.use("/api/school-info", schoolInfoRoutes);

// ASSIGN FAILSAFE MIDDLWEARES
app.use(middlewares.handleInvalidRoute); // Invalid Routes (404 Handler)
app.use(middlewares.handleGlobalErrors); // Global Error Handler

//================================================================

// SERVER
//================================================================
// START SERVER
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// GRACEFUL SHUTDOWN
const gracefulShutdown = async () => {
  await db.shutdownDB();
  console.log("✅ All services shut down gracefully");
  process.exit(0);
};
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
