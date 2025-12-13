import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import leadRoutes from "./routes/leadRoutes.js";
import { startFollowUpCron } from "./cron/followUpCron.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("CRM Backend is running ");
});

// KeepAlive route for uptime monitoring
app.get("/keepalive", (req, res) => {
  res.status(200).json({ alive: true, service: "crm-backend" });
});

// Connect DB + start Cron after successful connection
const initialize = async () => {
  await connectDB();

  // Start cron AFTER DB connection succeeds
  setTimeout(() => {
    startFollowUpCron();
  }, 2000);

  console.log(" Cron will start after DB initialization...");
};

initialize();

// Routes
app.use("/api/leads", leadRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
