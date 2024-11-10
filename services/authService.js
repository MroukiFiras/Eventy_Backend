import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

// Function to create a new user
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

// User Login
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

export default {
  createUserService,
  loginUserService,
};
