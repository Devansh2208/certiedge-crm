import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    organization: String,
    contactPerson: String,
    email: String,
    phone: String,
    course: String,

    // NEW FIELD: Tentative Course Date
    tentativeDate: { type: Date },

    trainerFound: { type: Boolean, default: false },
    trainerName: String,

    quoteAmount: Number,
    quoteSent: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["open", "in-progress", "completed", "closed"],
      default: "open",
    },

    remarks: [
      {
        text: { type: String, required: true },
        author: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
      }
    ],

    notificationsEnabled: { type: Boolean, default: true },
    lastNotificationAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Lead = mongoose.model("Lead", leadSchema);
