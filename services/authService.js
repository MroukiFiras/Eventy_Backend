import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import tokenUtils from "../utils/tokenUtils.js";

// Register User Service
const createUserService = async (name, email, password, phone) => {
  // Check if user with this email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("This email is already taken.");
  }

  // Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create a new user
  const user = new User({
    name,
    email,
    password: hashedPassword,
    phone,
    hasVerifiedEmail: false,
    tokenInfo: { token: "", tokenExpiration: null }, // Empty token initially
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
};

// Resend Verification Code using Email
const resendVerificationCodeWithEmail = async (email) => {
  const user = await User.findone({ email });
  if (!user) throw new Error("User not found.");

  // Generate a new verification token and update user data
  const verificationToken = tokenUtils.generateVerificationCode();
  user.tokenInfo = {
    token: verificationToken,
    tokenExpiration: Date.now() + 60000, // 1-min expiration
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
    tokenExpiration: Date.now() + 60000, // 1-min expiration
  };

  await user.save();
  await emailService.sendVerificationEmail(user.email, verificationToken);
  return { message: "Verification code resent. Please check your email." };
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
  verifyTokenService,
};
