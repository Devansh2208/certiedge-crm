import { sendNotification } from "./notificationService.js";

// Track last notification time per lead
const lastNotificationSent = {};

export const notifyOnChange = async ({ lead, message }) => {
  try {
    if (!lead) return;
    if (!lead.notificationsEnabled) return;

    const leadId = lead._id.toString();
    const now = Date.now();

    // ⏳ Debounce: allow only 1 email per lead every 2 minutes
    if (
      lastNotificationSent[leadId] &&
      now - lastNotificationSent[leadId] < 2 * 60 * 1000
    ) {
      console.log(`⏸️ Notification skipped (debounced) for lead ${leadId}`);
      return;
    }

    lastNotificationSent[leadId] = now;

    const recipients = [
      process.env.LOKESH_CONTACT,
      process.env.ANKUSH_CONTACT,
      process.env.ABIR_CONTACT,
    ].filter(Boolean); // remove undefined emails

    if (recipients.length === 0) {
      console.log("⚠️ No recipients configured, skipping email");
      return;
    }

    await sendNotification({
      recipients,
      message,
    });

    console.log(`📧 Change notification sent for lead ${leadId}`);
  } catch (error) {
    console.error("❌ Change notification failed:", error.message);
  }
};
