import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import leadRoutes from "./routes/leadRoutes.js";
import { startFollowUpCron } from "./cron/followUpCron.js";

dotenv.config();

const app = express();
let cronStarted = false;

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("CRM Backend is running ");
});

// KeepAlive route (UptimeRobot hits this)
app.get("/keepalive", (req, res) => {
  console.log("KeepAlive ping received");
  res.status(200).json({ alive: true, service: "crm-backend" });
});

// Initialize DB + Cron
const initialize = async () => {
  await connectDB();

  if (!cronStarted) {
    setTimeout(() => {
      startFollowUpCron();
      cronStarted = true;
      console.log(" Follow-up cron started");
    }, 2000);
  }
};

initialize();

// Routes
app.use("/api/leads", leadRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(" SERVER ERROR:", err);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
