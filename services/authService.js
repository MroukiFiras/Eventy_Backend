import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Function to create a new user
const createUserService = async (name, email, password, phone) => {
  // Check if user with this email or phone number already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("This email user already exists.");
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
  });

  // Save user to database
  return await user.save();
};

//User Login
const loginUserService = async (email, password) => {
  // Find user by email
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new Error("Invalid email or password.");
  }

  // Check if password matches
  const passwordCheck = await bcrypt.compare(password, user.password);
  if (!passwordCheck) {
    throw new Error("Invalid email or password.");
  }

  // If password is correct, generate and return a JWT token
  const authToken = generateAuthToken(user._id);
  return {
    message: "User logged in successfully.",
    authToken,
    user,
  };
};

// Function to generate JWT token
const generateAuthToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

export default {
  createUserService,
  loginUserService,
  generateAuthToken,
};
