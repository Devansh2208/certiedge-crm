import { sendNotification } from "./notificationService.js";

export const notifyOnChange = async ({ lead, message }) => {
  if (!lead || !lead.notificationsEnabled) return;

  const recipients = [
    process.env.LOKESH_CONTACT,
    process.env.ANKUSH_CONTACT,
    process.env.ABIR_CONTACT,
  ];

  await sendNotification({
    recipients,
    message,
  });
};
