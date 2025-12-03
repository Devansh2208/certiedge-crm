import nodemailer from "nodemailer";

export const sendNotification = async ({ recipients, message }) => {
  try {
    // Email transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS, // your app password
      },
    });

    // Email content
    const mailOptions = {
      from: `"CRM Alerts" <${process.env.EMAIL_USER}>`,
      to: recipients.join(","), // send to multiple recipients
      subject: "CRM Auto Notification",
      text: message,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    console.log(" Email sent to:", recipients);

  } catch (error) {
    console.error(" Email sending failed:", error);
  }
};
