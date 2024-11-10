import nodemailer from "nodemailer";

const sendEmail = async (to, { subject, message }) => {
  try {
    var smtpTransport = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_ADDR,
        pass: process.env.EMAIL_PASS,
      },
    });
    var mailOptions = {
      from: process.env.EMAIL_ADDR,
      to: to,
      subject: subject,
      html: message,
    };

    await smtpTransport.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
  }
};

export default {
  sendEmail,
};
