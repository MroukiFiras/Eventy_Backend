import authService from "../services/authService.js";
import tokenUtils from "../utils/tokenUtils.js";
import emailService from "../services/emailService.js"; 

const createUser = async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Passwords do not match.", state: false });
    }

    // Call the service to create a new user (without verifying email)
    const newUser = await authService.createUserService(
      name,
      email,
      password,
      phone
    );

    // Generate a verification token and send the verification email
    const verificationToken = tokenUtils.generateVerificationCode();
    await emailService.sendVerificationEmail(newUser.email, verificationToken);

    // Save the verification token in the database
    newUser.tokenInfo = {
      token: verificationToken,
      tokenExpiration: Date.now() + 3600000, // 1 hour expiration time
    };
    await newUser.save();

    // Send response with a message to check email for verification
    res.json({
      message:
        "User created successfully. Please check your email to verify your account.",
      state: true,
    });
  } catch (error) {
    console.error(`User creation failed: ${error.message}`);
    res.status(500).json({ message: error.message, state: false });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Call the service to login user
    const response = await authService.loginUserService(email, password);

    // Send the response
    res.header("auth-token", response.authToken).json({
      message: response.message,
      user: {
        id: response.user._id,
        name: response.user.name,
        email: response.user.email,
      },
      state: true,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
      state: false,
    });
  }
};

const logoutUser = (_, res) => {
  // Clear the auth-token header to log the user out
  res
    .header("auth-token", "")
    .json({ message: "User Logged Out", "auth-token": "" });
};

export default {
  createUser,
  loginUser,
  logoutUser,
};
