import authService from "../services/authService.js";
import tokenUtils from "../utils/tokenUtils.js";
import emailService from "../services/emailService.js";

const verificationExpiration = process.env.VERIFICATION_TOKEN_EXPIRATION;

// Create User Controller
const createUser = async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Passwords do not match.", state: false });
    }

    // Create user and generate verification token
    const newUser = await authService.createUserService(
      name,
      email,
      password,
      phone
    );
    const verificationToken = tokenUtils.generateVerificationCode();
    await emailService.sendVerificationEmail(newUser.email, verificationToken);

    newUser.tokenInfo = {
      token: verificationToken,
      tokenExpiration: Date.now() + parseInt(verificationExpiration),
    };
    await newUser.save();

    // Generate temporary auth-token for the new user
    const authToken = tokenUtils.generateAuthToken(newUser._id);
    res.header("auth-token", authToken).json({
      message:
        "User created successfully. Please check your email to verify your account.",
      state: true,
    });
  } catch (error) {
    // console.error(`User creation failed: ${error.message}`);
    res.status(500).json({ message: error.message, state: false });
  }
};

// Login User Controller
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

// Resend Verification Code Controller
const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    const userId = req.user ? req.user.id : null;
    // console.log(req.user); // Log req.user to check its structure

    let response;
    if (email) {
      // Resend using email if provided
      response = await authService.resendVerificationCodeWithEmail(email);
    } else if (userId) {
      // Resend using user ID if authenticated
      response = await authService.resendVerificationCodeWithId(userId);
    } else {
      return res.status(400).json({
        message: "No email or authentication provided",
        state: false,
      });
    }
    res.json({ message: response.message, state: true });
  } catch (error) {
    res.status(500).json({ message: error.message, state: false });
  }
};

// Request Password Reset
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const response = await authService.requestPasswordResetService(email);
    res.json({
      message: response.message,
      state: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resendPasswordResetToken = async () => {};

const verifyPasswordResetToken = async () => {};

// Verify Token Controller
const verifyToken = async (req, res) => {
  // console.log("verifyToken controller called"); // Check if endpoint is reached
  try {
    const { email, token } = req.body;
    // console.log(`Email: ${email}, Token: ${token}`); // Log request data

    const user = await authService.verifyTokenService(email, token);
    // console.log("User found and verified:", user); // Check if service worked

    res.json({ message: "Email is verified", state: true });
  } catch (err) {
    // console.error("Error in verifyToken:", err);
    res.status(500).json({ message: err.message, state: false });
  }
};

// Logout User Controller
const logoutUser = (_, res) => {
  // Clear the auth-token header to log the user out
  res
    .header("auth-token", "")
    .json({ message: "User Logged Out", "auth-token": "" });
};

export default {
  createUser,
  loginUser,
  resendVerificationCode,
  requestPasswordReset,
  resendPasswordResetToken,
  verifyPasswordResetToken,
  verifyToken,
  logoutUser,
};
