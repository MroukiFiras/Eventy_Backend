const formatVerificationEmail = (token) => {
  const contactEmail = process.env.EMAIL_ADDR;

  return `
    <div style="text-align: center; margin-top: 40px; max-width: 600px; margin: 0 auto; padding: 20px; font-family: Verdana, Geneva, Tahoma, sans-serif; color: #333;">
      <img src="https://res.cloudinary.com/db8sek2rg/image/upload/v1731271852/sendEmail_hc3wdn.png" style="width: 150px; margin-bottom: 20px;">
      <h1 style="font-size: 28px; color: #333; margin-bottom: 10px;">Welcome to Eventy - Your Social Outings Companion!</h1>
      <p style=" font-size: 16px; margin-bottom: 10px; text-align: left; font-weight: 400;">Hello there,</p>
      <p style=" font-size: 16px; margin-bottom: 20px; max-width: 500px; text-align: left; font-weight: 400;">
        We are thrilled to welcome you to Eventy, your go-to app for connecting with like-minded individuals and enjoying social outings. Here’s your verification code:
      </p>
      <h2 style="font-size: 30px; color: #570cf8; margin-bottom: 20px;">${token}</h2>
      <p style=" margin-bottom: 20px; text-align: left; font-weight: 400; font-size: 16px;">With Eventy, you can:</p>
      <ol style=" font-size: 16px; text-align: left; display: inline-block; margin: 0 auto; padding-left: 20px; max-width: 400px; font-weight: 400;">
        <li style="margin-bottom: 8px; margin-bottom: 8px;">Meet People with Similar Interests: Connect with individuals who share your passions and interests, whether it's sports, hobbies, food, or anything in between.</li>
        <li style="margin-bottom: 8px; margin-bottom: 8px;">User-Friendly Interface: Navigate the app with ease and discover exciting events, activities, and friendly outings with a few simple taps.</li>
        <li style="margin-bottom: 8px; margin-bottom: 8px;">Enhanced Privacy and Security: We take your privacy seriously. Rest assured that your information is safe and secure.</li>
        <li style="margin-bottom: 8px; margin-bottom: 8px;">Real-Time Notifications: Stay up-to-date with instant notifications about upcoming events, new connections, and messages from fellow users.</li>
      </ol>
      <p style="margin-top: 20px; text-align: left; font-size: 16px; font-weight: 400;">
        If you have any questions or need assistance, our support team is here to help. Contact us at <a href="mailto:${contactEmail}">${contactEmail}</a>.
      </p>
      <p style="text-align: left; font-size: 16px; font-weight: 400;">Best regards,<br>The Eventy Team</p>
    </div>
  `;
};

export default {
  formatVerificationEmail,
};
