const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatVerificationEmail = (token) => {
  const contactEmail = process.env.EMAIL_ADDR;

  return `
    <div style="text-align: center; margin-top: 40px; max-width: 600px; margin: 0 auto; padding: 20px; font-family: Verdana, Geneva, Tahoma, sans-serif; color: #333;">
      <img src="https://res.cloudinary.com/db8sek2rg/image/upload/v1731271852/sendEmail_hc3wdn.png" style="width: 150px; margin-bottom: 20px;">
      <h1 style="font-size: 28px; color: #333 !important; margin-bottom: 10px;">Welcome to Eventy - Your Social Outings Companion!</h1>
      <p style="font-size: 16px; margin-bottom: 10px; text-align: left; font-weight: 400; color: #333 !important;">Hello there,</p>
      <p style="font-size: 16px; margin-bottom: 20px; max-width: 500px; text-align: left; font-weight: 400; color: #333 !important;">
        We are thrilled to welcome you to Eventy, your go-to app for connecting with like-minded individuals and enjoying social outings. Here’s your verification code:
      </p>
      <h2 style="font-size: 30px; color: #570cf8 !important; margin-bottom: 20px;">${token}</h2>
      <p style="margin-bottom: 20px; text-align: left; font-weight: 400; font-size: 16px; color: #333 !important;">With Eventy, you can:</p>
      <ol style="font-size: 16px; text-align: left; display: inline-block; margin: 0 auto; padding-left: 20px; max-width: 400px; font-weight: 400; color: #333 !important;">
        <li style="margin-bottom: 8px;">Meet People with Similar Interests: Connect with individuals who share your passions and interests, whether it's sports, hobbies, food, or anything in between.</li>
        <li style="margin-bottom: 8px;">User-Friendly Interface: Navigate the app with ease and discover exciting events, activities, and friendly outings with a few simple taps.</li>
        <li style="margin-bottom: 8px;">Enhanced Privacy and Security: We take your privacy seriously. Rest assured that your information is safe and secure.</li>
        <li style="margin-bottom: 8px;">Real-Time Notifications: Stay up-to-date with instant notifications about upcoming events, new connections, and messages from fellow users.</li>
      </ol>
      <p style="margin-top: 20px; text-align: left; font-size: 16px; font-weight: 400; color: #333 !important;">
        If you have any questions or need assistance, our support team is here to help. Contact us at <a href="mailto:${contactEmail}" style="color: #570cf8 !important;">${contactEmail}</a>.
      </p>
      <p style="text-align: left; font-size: 16px; font-weight: 400; color: #333 !important;">Best regards,<br>The Eventy Team</p>
    </div>
  `;
};

const formatPasswordResetEmail = (resetToken) => {
  const resetLink = `${process.env.FRONTEND_URL}/resetPassword?token=${resetToken}`;
  return `
    <div style="text-align: center; margin-top: 40px; max-width: 600px; margin: 0 auto; padding: 20px; font-family: Verdana, Geneva, Tahoma, sans-serif; color: #333;">
      <h1 style="font-size: 28px; color: #333;">Reset Your Password</h1>
      <p style="font-size: 16px;">Click the link below to reset your password:</p>
      <a href="${resetLink}" style="font-size: 16px; color: #570cf8;">Reset Password</a>
      <p style="font-size: 16px; color: #333;">This link will expire in 1 hour.</p>
    </div>
  `;
};

const formatGetApprovedEmail = (user, event, qrCodeUrl) => {
  return `
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
    <div style="text-align: center; padding: 20px; background-color: #4CAF50; color: white; border-radius: 8px 8px 0 0;">
      <h1 style="margin: 0;">Participation Approved! 🎉</h1>
    </div>
    
    <div style="padding: 20px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px;">
      <p style="margin-top: 0;">Dear ${user.name},</p>
      
      <p>Great news! Your participation request for <strong>${
        event.title
      }</strong> has been approved.</p>
      
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h2 style="margin-top: 0; color: #2c3e50;">Event Details</h2>
        <p style="margin: 5px 0;"><strong>Date & Time:</strong> ${formatDate(
          event.date
        )}</p>
        <p style="margin: 5px 0;"><strong>Location:</strong> ${
          event.location
        }</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <p style="font-weight: bold; color: #2c3e50;">Your Entry QR Code</p>
        <img src="${qrCodeUrl}" alt="QR Code" style="max-width: 200px; border: 1px solid #e0e0e0; padding: 10px; border-radius: 8px;">
        <p style="color: #666; font-size: 14px;">Please present this QR code at the event check-in</p>
      </div>
      
      <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; color: #856404;"><strong>Important:</strong> Don't forget to bring your QR code to the event. You can either show it on your phone or bring a printed copy.</p>
      </div>
    </div>
    
    <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
      <p>This is an automated message, please do not reply to this email.</p>
      <p>© ${new Date().getFullYear()} Event Management System. All rights reserved.</p>
    </div>
  </div>
  
  `;
};

const formatGetRejectedEmail = (user, event) => {};

export default {
  formatVerificationEmail,
  formatPasswordResetEmail,
  formatGetApprovedEmail,
  formatGetRejectedEmail,
};
