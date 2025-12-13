import nodemailer from "nodemailer";

export const sendNotification = async ({ recipients, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: `"CRM Alerts" <${process.env.EMAIL_USER}>`,
      to: recipients.join(","),
      subject: "CRM Auto Notification",
      text: message
    };

    await transporter.sendMail(mailOptions);

    console.log("📧 Gmail Email sent to:", recipients);

  } catch (error) {
    console.error("❌ Gmail email sending failed:", error);
  }
};
