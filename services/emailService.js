import nodemailer from "nodemailer";
import emailUtils from "../utils/emailUtils.js";
import tokenUtils from "../utils/tokenUtils.js";

// Sends an email using nodemailer.
const sendEmail = async (to, { subject, message }) => {
  try {
    const smtpTransport = nodemailer.createTransport({
      service: "Gmail",
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: "Eventy App",
      to,
      subject,
      html: message,
    };

    await smtpTransport.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send email: ${error.message}`);
  }
};

// Sends a verification email with a generated token.
const sendVerificationEmail = async (to) => {
  const verificationCode = tokenUtils.generateVerificationCode();
  const emailContent = {
    subject: "Eventy! Confirm your email address",
    message: emailUtils.formatVerificationEmail(verificationCode),
  };
  console.log(`Email sent to ${to}`);
  await sendEmail(to, emailContent);
};

export default {
  sendEmail,
  sendVerificationEmail,
};
