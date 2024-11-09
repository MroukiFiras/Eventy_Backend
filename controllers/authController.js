import authService from "../services/authService.js";

const createUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Call the service to create a new user
    const newUser = await authService.createUserService(
      name,
      email,
      password,
      phone
    );

    // Generate a JWT token for the user
    const authToken = authService.generateAuthToken(newUser._id);

    // Send response
    res.header("auth-token", authToken).json({
      message: "User has been created.",
      user: {
        id: newUser._id,
        name: newUser.name,
      },
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
    .header("auth-token", "") // Remove the auth-token from the header
    .json({ message: "User Logged Out", "auth-token": "" }); // Send confirmation message
};
export default {
  createUser,
  loginUser,
  logoutUser,
};
