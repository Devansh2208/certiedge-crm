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

// MongoDB
connectDB();

// Routes
app.use("/api/leads", leadRoutes);

// Start Cron
startFollowUpCron();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT} 🚀`);
});
