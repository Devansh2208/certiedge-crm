import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    organization: String,
    contactPerson: String,
    email: String,
    phone: String,
    course: String,

    trainerFound: { type: Boolean, default: false },
    trainerName: String,

    quoteAmount: Number,
    quoteSent: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["open", "in-progress", "completed", "closed"],
      default: "open",
    },

    notificationsEnabled: { type: Boolean, default: true },
    lastNotificationAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Lead = mongoose.model("Lead", leadSchema);
