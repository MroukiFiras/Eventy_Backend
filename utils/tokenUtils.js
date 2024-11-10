import jwt from "jsonwebtoken";

// Function to generate JWT token
const generateAuthToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.AUTH_TOKEN_SECRET, {
    expiresIn: "1h",
  });
};

// Generates a 6-digit numeric verification code.
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export default {
  generateAuthToken,
  generateVerificationCode,
};
