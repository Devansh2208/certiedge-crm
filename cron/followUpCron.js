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

      // 1️ Trainer not yet found
      if (!lead.trainerFound) {
        recipients = [process.env.LOKESH_CONTACT];
        message = `Reminder: Please find a trainer for the upcoming course and update the status when done.`;

      // 2️ Trainer found but quote NOT sent
      } else if (lead.trainerFound && !lead.quoteSent) {
        recipients = [
          process.env.LOKESH_CONTACT,
          process.env.ANKUSH_CONTACT,
        ];
        message = `Please share a quote for the upcoming course and update the status when done.`;

      // 3️ Trainer found AND quote sent → Follow-up with the client
      } else if (lead.trainerFound && lead.quoteSent) {
        recipients = [
          process.env.LOKESH_CONTACT,
          process.env.ANKUSH_CONTACT,
        ];
        message = `Please follow up with the client ${lead.contactPerson} for the upcoming course ${lead.course} and update the status once done.`;

      } else {
        // Otherwise disable notifications
        lead.notificationsEnabled = false;
        await lead.save();
        continue;
      }

      // Send notification
      sendNotification({ recipients, message });

      // Update last notification time
      lead.lastNotificationAt = now;
      await lead.save();
    }
  });

  console.log("Follow-Up Cron Activated ");
};
