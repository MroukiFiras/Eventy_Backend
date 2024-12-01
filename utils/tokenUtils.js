import jwt from "jsonwebtoken";
import crypto from "crypto";

// Function to generate JWT token
const generateAuthToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.userRole,
    },
    process.env.AUTH_TOKEN_SECRET,
    {
      expiresIn: process.env.JWT_TOKEN_EXPIRATION,
    }
  );
};

const generateAuthTokenForPasswordReset = (email) => {
  return jwt.sign(
    {
      id: email,
    },
    process.env.AUTH_TOKEN_SECRET,
    {
      expiresIn: process.env.JWT_TOKEN_EXPIRATION,
    }
  );
};

// Generates a 6-digit numeric verification code.
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateSignedQrCodeData = (userId, eventId) => {
  const data = `${userId}-${eventId}-${Date.now()}`;
  const signature = crypto
    .createHmac("sha256", process.env.SECRET_KEY)
    .update(data)
    .digest("hex");
  return `${data}-${signature}`;
};

export default {
  generateAuthToken,
  generateAuthTokenForPasswordReset,
  generateVerificationCode,
  generateSignedQrCodeData,
};
