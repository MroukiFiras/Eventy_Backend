const formatDateTime = (date, time) => {
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
    new Date(date)
  );
  return `${formattedDate} T${time}`;
};

const contactEmail = process.env.EMAIL_ADDR;

const formatVerificationEmail = (token) => {
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
      <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
        <p>This is an automated message, please do not reply to this email.</p>
        <p>© ${new Date().getFullYear()} Eventy Management System. All rights reserved.</p>
      </div>
    </div>
  `;
};

const formatPasswordResetEmail = (resetToken) => {
  const resetLink = `${process.env.FRONTEND_URL}/resetPassword?token=${resetToken}`;
  return `
    <div
        style="text-align: center; max-width: 600px; margin: 40px auto; padding: 40px 20px; 
        font-family: Verdana, Geneva, Tahoma, sans-serif; color: #333; background-color: #ffffff; 
        border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        
        <div style="margin-bottom: 30px;">
            <img src="https://res.cloudinary.com/db8sek2rg/image/upload/v1732478626/forgot_jmtvd9.png" alt="Lock Icon"
                style="width: 100%; max-width: 600px; height: auto;">
        </div>

        <h2 style="font-size: 24px; font-weight: bold; margin: 0 0 30px; color: #333333;">
            Reset Your Password
        </h2>

        <div style="text-align: left; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
            <p>Hello there,</p>
            <p>
                We’ve received a request to reset your password. If you didn’t make this request, you can safely ignore
                this email. Otherwise, click the button below to proceed with resetting your password:
            </p>
        </div>

        <a href="${resetLink}" style="display: inline-block; 
                  background-color: #570cf8; 
                  color: white; 
                  padding: 15px 40px; 
                  text-decoration: none; 
                  border-radius: 50px; 
                  font-size: 16px; 
                  font-weight: bold; 
                  margin-top: 20px;
                  transition: background-color 0.3s ease;">
            RESET PASSWORD
        </a>

        <p style="font-size: 14px; margin-top: 25px; margin-bottom: 35px;">
            Note: This link will expire in 1 hour.
        </p>

        <div style="text-align: left; font-size: 16px; line-height: 1.6;">
            <p>
                If you have any questions or need assistance, our support team is here to help. Contact us at
                <a href="mailto:${contactEmail}" style="color: #570cf8; text-decoration: none; font-weight: bold;">
                    ${contactEmail}
                </a>.
            </p>
            <p>Best regards,<br>The Eventy Team</p>
        </div>
    </div>

    <div
        style="text-align: center; padding: 20px; font-family: Verdana, Geneva, Tahoma, sans-serif; 
        color: #666; font-size: 12px;">
        <p>This is an automated message, please do not reply to this email.</p>
        <p>© ${new Date().getFullYear()} Eventy Management System. All rights reserved.</p>
    </div>
  `;
};

const formatGetApprovedEmail = (user, event) => {
  return `
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; font-family: Verdana, Geneva, Tahoma, sans-serif; color: #333;">
    <div style="text-align: center; padding: 20px; background-color: #570cf8; color: white; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">Participation Approved!</h1>
    </div>

    <div style="padding: 20px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px;">
        <p style="margin-top: 0; font-size: 16px; font-weight: 400; color: #333;">Dear ${
          user.name
        },</p>
        <p style="font-size: 16px; font-weight: 400; color: #333;">Great news! We are excited to inform you that your participation request for <strong style="color: #570cf8;">${
          event.title
        }</strong> has been approved.</p>

        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #2c3e50;">Event Details</h2>
            <p style="font-size: 16px; font-weight: 400; color: #333; margin: 5px 0;"><strong>Date & Time:</strong> ${formatDateTime(
              event.dateTime.dates,
              event.dateTime.times
            )}</p>
            <p style="font-size: 16px; font-weight: 400; color: #333; margin: 5px 0;"><strong>Location:</strong> ${
              event.location
            }</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
            <p style="font-weight: bold; color: #2c3e50;">Your Entry QR Code</p>
            <img src="cid:qrcode" alt="QR Code" style="max-width: 200px; border: 1px solid #e0e0e0; padding: 10px; border-radius: 8px;">
            <p style="color: #666; font-size: 14px;">Please present this QR code at the event check-in</p>
        </div>

        <div style="text-align: left; margin-top: 20px; font-size: 16px; font-weight: 400; color: #333;">
            <p>If you have any questions or need assistance, our dedicated support team is available to assist you. We’re just an email away at 
                <a href="mailto:${contactEmail}" style="color: #570cf8; font-weight: bold; text-decoration: none;">${contactEmail}</a>.
            </p>
        </div>
        <p style="text-align: left; font-size: 16px; font-weight: 400; color: #333;">Best regards,<br>The Eventy Team</p>

        <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #856404;"><strong>Important:</strong> Remember to bring your QR code to the event. You can show it on your phone or print it out for entry.</p>
        </div>
    </div>

    <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
        <p>This is an automated message, please do not reply to this email.</p>
        <p>© ${new Date().getFullYear()} Eventy Management System. All rights reserved.</p>
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
