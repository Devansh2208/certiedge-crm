import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import leadRoutes from "./routes/leadRoutes.js";
import { startFollowUpCron } from "./cron/followUpCron.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("CRM Backend is running");
});

// dummy KeepAlive Route for UptimeRobot
app.get("/keepalive", (req, res) => {
  res.status(200).json({ alive: true, service: "crm-backend" });
});

// MongoDB
connectDB();

// Routes
app.use("/api/leads", leadRoutes);

// Cron Job
startFollowUpCron();

// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
