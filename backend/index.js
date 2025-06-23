import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import db from "./config/database.js";

// Import routes
import UserRoute from "./routes/userroutes.js";
import FileRoute from "./routes/fileroutes.js";

import "./models/association.js"; 

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/users", UserRoute);
app.use("/api/files", FileRoute);

// Root Route
app.get("/", (req, res) => {
  res.json({ msg: "📁 Welcome to the File Storage API" });
});

// Start server
const startServer = async () => {
  try {
    await db.authenticate();
    console.log("✅ Database connected...");

    await db.sync(); // Bisa juga: { alter: true } jika sedang pengembangan
    console.log("✅ Database synced...");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection error:", error);
  }
};

startServer();
