import cron from "node-cron";
import { Lead } from "../models/Lead.js";
import { sendNotification } from "../utils/notificationService.js";

export const startFollowUpCron = () => {
  cron.schedule("0 */2 * * *", async () => {
    console.log("⏰ Running follow-up cron...");

    const leads = await Lead.find({
      notificationsEnabled: true,
      status: { $in: ["open", "in-progress"] },
    });

    const now = new Date();

    for (const lead of leads) {
      let recipients = [];
      let message = "";

      // Case 1: Trainer not yet found
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


      // Case 3: Trainer found + Quote sent → Follow-up with client
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
        // If none match, stop notifications
        lead.notificationsEnabled = false;
        await lead.save();
        continue;
      }

      // Send email
      console.log(`Sending notification for lead ${lead._id} to:`, recipients);      
      sendNotification({ recipients, message });

      // Update timestamp
      lead.lastNotificationAt = now;
      await lead.save();
    }
  });

  console.log(" Follow-Up Cron Activated");

  // Run test email AFTER 3 seconds (Render-safe)
  setTimeout(() => {
    sendNotification({
      recipients: [
        process.env.LOKESH_CONTACT,
        process.env.ANKUSH_CONTACT,
        process.env.ABIR_CONTACT,
      ],
      message: " Test Email: CRM notifications are working successfully!",
    });
  }, 3000);
};
