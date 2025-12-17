import nodemailer from "nodemailer";

export const sendNotification = async ({ recipients, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // must be false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 10000,
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: `"CRM Alerts" <${process.env.EMAIL_USER}>`,
      to: recipients.join(","),
      subject: "CRM Notification",
      text: message,
    });

    console.log("📧 Gmail Email sent to:", recipients);
  } catch (error) {
    console.error("❌ Gmail email sending failed:", error);
  }
};
