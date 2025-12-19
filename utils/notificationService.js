import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const sendNotification = async ({ recipients, message }) => {
  try {
    if (!recipients || recipients.length === 0) return;

    const params = {
      Source: process.env.EMAIL_USER, // must be SES-verified
      Destination: {
        ToAddresses: recipients,
      },
      Message: {
        Subject: {
          Data: "CRM Notification",
        },
        Body: {
          Text: {
            Data: message,
          },
        },
      },
    };

    await ses.send(new SendEmailCommand(params));

    console.log("📧 SES email sent to:", recipients);
  } catch (error) {
    console.error("❌ SES email failed:", error.message);
  }
};
