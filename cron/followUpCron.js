import cron from "node-cron";
import { Lead } from "../models/Lead.js";
import { sendNotification } from "../utils/notificationService.js";

// 🔁 CORE LOGIC (reusable)
export const runFollowUpCheck = async (isManual = false) => {
  console.log(
    isManual
      ? "🧪 Manual follow-up trigger running..."
      : "⏰ Scheduled follow-up cron running..."
  );

  const leads = await Lead.find({
    notificationsEnabled: true,
    status: { $in: ["open", "in-progress"] },
  });

  const now = new Date();

  for (const lead of leads) {
    let recipients = [];
    let message = "";

    // Case 1: Trainer not found
    if (!lead.trainerFound) {
      recipients = [process.env.LOKESH_CONTACT];
      message = `🔔 Reminder: Please find a trainer for the course "${lead.course}" and update the status.`;

    // Case 2: Trainer found but quote not sent
    } else if (lead.trainerFound && !lead.quoteSent) {
      recipients = [
        process.env.LOKESH_CONTACT,
        process.env.ANKUSH_CONTACT,
        process.env.ABIR_CONTACT,
      ];
      message = `📄 Reminder: Trainer confirmed. Please send the quote for "${lead.course}".`;

    // Case 3: Trainer + Quote sent → Follow-up
    } else if (lead.trainerFound && lead.quoteSent) {
      recipients = [
        process.env.LOKESH_CONTACT,
        process.env.ANKUSH_CONTACT,
        process.env.ABIR_CONTACT,
      ];

      const dateFormatted = lead.tentativeDate
        ? new Date(lead.tentativeDate).toLocaleDateString()
        : "TBD";

      message = `📞 Follow-up Reminder:
Client: ${lead.contactPerson}
Course: ${lead.course}
Tentative Date: ${dateFormatted}

Please follow up with the client and update the CRM.`;
    } else {
      continue;
    }

    console.log(`📧 Sending notification for lead ${lead._id}`);
    await sendNotification({ recipients, message });

    lead.lastNotificationAt = now;
    await lead.save();
  }
};

// ⏰ REAL CRON (every 2 hours)
export const startFollowUpCron = () => {
  cron.schedule("0 */2 * * *", async () => {
    await runFollowUpCheck(false);
  });

  console.log("⏰ Follow-Up Cron Activated");
};
