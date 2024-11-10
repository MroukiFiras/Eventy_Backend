import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

/**
 * Verifies if the Authorization token is valid and returns the decoded token if valid.
 * @param {Object} headers - Request headers object.
 * @returns {Object|null} - Decoded token if valid, null otherwise.
 */
const isAuthenticated = (headers) => {
  // console.log("Received Headers:", headers); // Log headers to see what is being passed
  const authToken = headers["authorization"]?.split(" ")[1]; // Extract token from "Authorization: Bearer <token>"
  // console.log("Token received:", authToken);
  if (!authToken) return null;

  try {
    const verifyToken = jwt.verify(authToken, process.env.AUTH_TOKEN_SECRET);
    return verifyToken; // If the token is valid, return the decoded token
  } catch (err) {
    console.error(`Authentication Error: ${err.message}`);
    return null;
  }
};

/**
 * Middleware to check if the request contains a valid Authorization token.
 */
const authTokenCheck = (req, res, next) => {
  if (isAuthenticated(req.headers)) {
    next();
  } else {
    res.status(400).json({ message: "Invalid Token", state: false });
  }
};

/**
 * Middleware to authenticate the user and update their block status if applicable.
 */
const checkUser = async (req, res, next) => {
  const token = isAuthenticated(req.headers);

  if (token) {
    try {
      // Make sure token contains user ID (e.g., token.id), and verify user exists
      const user = await User.findById(token.id); // Assumes `id` is in the token payload
      if (user) {
        // Check and update block status
        user.blockStatus = checkBlockState(user.blockStatus);
        await user.save();

        req.user = user; // Attach user to request for subsequent middleware
        next();
      } else {
        res
          .status(400)
          .json({ message: "User not found or invalid token", state: false });
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      res.status(500).json({ message: "Internal Server Error", state: false });
    }
  } else {
    res.status(400).json({ message: "Invalid Token", state: false });
  }
};

/**
 * Checks the `blockStatus` of a user.
 * If the block duration has expired, updates `isBlocked` to `false`.
 * @param {Object} status - The current `blockStatus` object of the user.
 * @returns {Object} Updated `blockStatus` object.
 */
const checkBlockState = (status) => {
  if (!status.isBlocked) return status;

  // If current date is past the block expiration, unblock the user
  if (Date.now() >= status.to) {
    status.isBlocked = false;
  }
  return status;
};

export default { authTokenCheck, checkUser };
