import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { Lead } from "./models/Lead.js";

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

// Seed data
async function seedData() {
  try {
    // Clear existing leads (optional)
    await Lead.deleteMany({});
    console.log("Old leads removed.");

    // Create sample leads
    const leads = await Lead.insertMany([
      {
        name: "Rahul Sharma",
        organization: "TechSoft",
        contactPerson: "Rahul",
        email: "rahul@example.com",
        phone: "9876543210",
        course: "Python",
        remarks: []
      },
      {
        name: "Neha Verma",
        organization: "SkillEdge",
        contactPerson: "Neha",
        email: "neha@example.com",
        phone: "9123456789",
        course: "Java",
        remarks: []
      },
      {
        name: "Amit Kumar",
        organization: "EduWorks",
        contactPerson: "Amit",
        email: "amit@example.com",
        phone: "9988776655",
        course: "AWS",
        remarks: []
      }
    ]);

    console.log(" Sample leads added.");

    // Add remarks to each lead
    for (const lead of leads) {
      await Lead.findByIdAndUpdate(lead._id, {
        $push: {
          remarks: {
            text: "Initial follow-up done.",
            author: "Devansh",
            timestamp: new Date(),
          },
        },
      });

      await Lead.findByIdAndUpdate(lead._id, {
        $push: {
          remarks: {
            text: "Client requested more details.",
            author: "Lokesh",
            timestamp: new Date(),
          },
        },
      });
    }

    console.log("Remarks added to all leads.");

    console.log("SEEDING COMPLETE!");
    console.log(" Here are the created leads:");

    const finalLeads = await Lead.find();
    console.log(finalLeads);

    process.exit(0);

  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

// Run
(async () => {
  await connectDB();
  await seedData();
})();
