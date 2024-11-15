import jwt from "jsonwebtoken";

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

// Generates a 6-digit numeric verification code.
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export default {
  generateAuthToken,
  generateVerificationCode,
};
