const formatVerificationEmail = (token) => {
  const contactEmail = process.env.EMAIL_ADDR;

  return `
    <div style="text-align: center; font-family: Arial, sans-serif;">
      <img src="https://res.cloudinary.com/db8sek2rg/image/upload/v1731244523/sendEmail_k58som.png"  style="width: 150px; margin-bottom: 20px;">
      <h1>Welcome to Eventy - Your Social Outings Companion!</h1>
      <p>Hello there,</p>
      <p>We are thrilled to welcome you to Eventy, your go-to app for connecting with like-minded individuals and enjoying social outings. Here’s your verification code:</p>
      <h2 style="font-size: 24px; color: #4CAF50;">${token}</h2>
      <p>Enter this code in the app to verify your account.</p>
      <p>With Eventy, you can:</p>
      <ul style="text-align: start; display: inline-block; margin: 0 auto;">
        <li>Meet people with similar interests</li>
        <li>Enjoy a user-friendly interface</li>
        <li>Experience enhanced privacy and security</li>
        <li>Receive real-time notifications</li>
      </ul>
      <p>
        If you have any questions or need assistance, our support team is here to help. Contact us at <a href="mailto:${contactEmail}">${contactEmail}</a>.
      </p>
      <p>Best regards,<br>The Eventy Team</p>
    </div>
  `;
};

export default {
  formatVerificationEmail,
};
