import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import tokenUtils from "../utils/tokenUtils.js";
import emailService from "./emailService.js";

const verificationExpiration = process.env.VERIFICATION_TOKEN_EXPIRATION;
const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);

// Register User Service
const createUserService = async (name, email, password, phone) => {
  // Check if user with this email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("This email is already taken.");
  }

  // Hash the password

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create a new user
  const user = new User({
    name,
    email,
    password: hashedPassword,
    phone,
    hasVerifiedEmail: false,
    tokenInfo: { token: "", tokenExpiration: null },
  });

  // Save user to database
  return await user.save();
};

// Login User Service
const loginUserService = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password.");
  }

  // Check if password matches
  const passwordCheck = await bcrypt.compare(password, user.password);
  if (!passwordCheck) {
    throw new Error("Invalid email or password.");
  }
  const authToken = tokenUtils.generateAuthToken(user);
  return {
    message: "Login successful",
    authToken,
    user,
  };
};

// Resend Verification Code using Email
const resendVerificationCodeWithEmail = async (email) => {
  const user = await User.findone({ email });
  if (!user) throw new Error("User not found.");

  // Generate a new verification token and update user data
  const verificationToken = tokenUtils.generateVerificationCode();
  user.tokenInfo = {
    token: verificationToken,
    tokenExpiration: Date.now() + parseInt(verificationExpiration),
  };

  await user.save();
  await emailService.sendVerificationEmail(user.email, verificationToken);
  return { message: "Verification code resent. Please check your email." };
};

// Resend Verification Code using Authenticated User ID
const resendVerificationCodeWithId = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found.");

  // Generate a new verification token and update user data
  const verificationToken = tokenUtils.generateVerificationCode();
  user.tokenInfo = {
    token: verificationToken,
    tokenExpiration: Date.now() + parseInt(verificationExpiration),
  };

  await user.save();
  await emailService.sendVerificationEmail(user.email, verificationToken);
  return { message: "Verification code resent. Please check your email." };
};

// Request Password Reset Service (for first request)
const requestPasswordResetService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found.");

  // Generate a password reset token
  const resetToken = tokenUtils.generateAuthToken(email);

  // Store the reset token and its expiration time in the user's tokenInfo field
  user.tokenInfo = {
    token: resetToken,
    tokenExpiration: Date.now() + parseInt(verificationExpiration),
  };
  await user.save();

  // Send reset password email to the user
  await emailService.sendPasswordResetEmail(email, resetToken);

  return { message: "Password reset email sent." };
};

// Resend Password Reset Token Service (for existing users with expired token)
const resendPasswordResetTokenService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found.");

  // If there is already an existing token but it's expired, create a new one
  const resetToken = tokenUtils.generateAuthToken(email);

  // Update the token and expiration time in the user's tokenInfo field
  user.tokenInfo = {
    token: resetToken,
    tokenExpiration: Date.now() + parseInt(verificationExpiration),
  };
  await user.save();

  // Send reset password email to the user with the new token
  await emailService.sendPasswordResetEmail(email, resetToken);

  return { message: "Password reset email resent. Please check your inbox." };
};

// Verify Password Reset Token Service
const verifyPasswordResetTokenService = async (email, resetToken) => {
  const user = await User.findOne({
    email,
    "tokenInfo.token": resetToken,
    "tokenInfo.tokenExpiration": { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Invalid or expired reset token.");
  }

  return user;
};

// Password Reset Service
const passwordResetService = async (email, resetToken, newPassword) => {
  // Use the verifyPasswordResetTokenService to validate token and get the user
  const user = await verifyPasswordResetTokenService(email, resetToken);

  // Hash the new password before saving it
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  // Update the user's password and remove token info
  user.password = hashedPassword;

  user.tokenInfo = undefined; // Remove the token after successful reset
  await user.save();

  return { message: "Password reset successfully." };
};

// Verify Token Service
const verifyTokenService = async (email, token) => {
  const user = await User.findOne({
    email,
    "tokenInfo.token": token,
    "tokenInfo.tokenExpiration": { $gt: Date.now() },
  });
  if (!user) throw new Error("User not found or token expired.");
  user.hasVerifiedEmail = true;
  user.tokenInfo = undefined;
  await user.save();

  return user;
};

export default {
  createUserService,
  loginUserService,
  resendVerificationCodeWithEmail,
  resendVerificationCodeWithId,
  requestPasswordResetService,
  resendPasswordResetTokenService,
  verifyPasswordResetTokenService,
  passwordResetService,
  verifyTokenService,
};
