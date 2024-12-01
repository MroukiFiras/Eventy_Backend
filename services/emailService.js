import nodemailer from "nodemailer";
import emailUtils from "../utils/emailUtils.js";

// Sends an email using nodemailer
const sendEmail = async (to, { subject, message, attachments = [] }) => {
  try {
    const smtpTransport = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: '"Eventy App" <example@gmail.com>',
      to,
      subject,
      html: message,
      attachments, 
    };

    await smtpTransport.sendMail(mailOptions);
    // console.log(`Email sent to ${to}`);
  } catch (error) {
    // console.error(`Failed to send email: ${error.message}`);
    throw new Error("Failed to send email.");
  }
};

// Sends a verification email with a generated token
const sendVerificationEmail = async (to, verificationToken) => {
  const emailContent = {
    subject: "Eventy! Confirm your email address",
    message: emailUtils.formatVerificationEmail(verificationToken),
  };
  // console.log(`Email sent to ${to}`);
  await sendEmail(to, emailContent);
};

// Sends a reset email with a generated token
const sendPasswordResetEmail = async (to, resetToken) => {
  const emailContent = {
    subject: "Eventy! Forgot password",
    message: emailUtils.formatPasswordResetEmail(resetToken),
  };
  await sendEmail(to, emailContent);
};

// Send email based on participation status
const sendParticipationEmail = async (user, event, qrCodeUrl, status) => {
  let emailContent;

  if (status === "approved") {
    emailContent = {
      subject: `Eventy! Your Participation Request for ${event.title} Has Been Approved!`,
      message: emailUtils.formatGetApprovedEmail(user, event), 
      attachments: [
        {
          filename: "qrcode.png",
          content: qrCodeUrl.split(",")[1], 
          encoding: "base64",
          cid: "qrcode",
        },
      ],
    };
  } else if (status === "rejected") {
    emailContent = {
      subject: `Eventy! Your Participation Request for ${event.title} Has Been Rejected`,
      message: emailUtils.formatGetRejectedEmail(user, event),
    };
  }

  await sendEmail(user.email, emailContent);
};

export default {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendParticipationEmail,
};
