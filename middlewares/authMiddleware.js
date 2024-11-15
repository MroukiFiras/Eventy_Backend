import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Verifies if the Authorization token is valid and returns the decoded token if valid.
const isAuthenticated = (headers) => {
  // console.log("Received Headers:", headers); // Log headers to see what is being passed
  const authToken = headers["authorization"]?.split(" ")[1]; // Extract token from "Authorization: Bearer <token>"
  // console.log("Token received:", authToken);
  if (!authToken) return null;

  try {
    const decodedToken = jwt.verify(authToken, process.env.AUTH_TOKEN_SECRET);
    return decodedToken; // If the token is valid, return the decoded token
  } catch (err) {
    console.error(`Authentication Error: ${err.message}`);
    return null;
  }
};

// Middleware to check if the request contains a valid Authorization token.
const authTokenCheck = (req, res, next) => {
  const decodedToken = isAuthenticated(req.headers); // Get decoded token
  if (decodedToken) {
    req.user = decodedToken; // Attach the decoded token (user info) to the request object
    next(); // Proceed to the next middleware/controller
  } else {
    res.status(400).json({ message: "Invalid Token", state: false });
  }
};

// Middleware to authenticate the user and update their block status if applicable.
const checkUser = async (req, res, next) => {
  const decodedToken = isAuthenticated(req.headers);

  if (decodedToken) {
    try {
      // Make sure token contains user ID (e.g., decodedToken.id), and verify user exists
      const user = await User.findById(decodedToken.id); // Assumes `id` is in the token payload
      if (user) {
        // Check and update block status
        user.blockStatus = checkBlockState(user.blockStatus);
        await user.save();

        req.user = user; // Attach user to request for subsequent middleware
        next();
      } else {
        res
          .status(404)
          .json({ message: "User not found or invalid token", state: false });
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      res.status(500).json({ message: "Internal Server Error", state: false });
    }
  } else {
    res.status(401).json({ message: "Invalid or missing token", state: false });
  }
};

// Middleware to check if the user has admin privileges
const isAdmin = async (req, res, next) => {
  const decodedToken = isAuthenticated(req.headers);

  if (decodedToken) {
    try {
      const user = await User.findById(decodedToken.id);
      if (user && user.userRole && user.userRole.admin) {
        next(); // Proceed if the user is an admin
      } else {
        res.status(403).json({
          message: "Access denied: Admin privileges required",
          state: false,
        });
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      res.status(500).json({ message: "Internal Server Error", state: false });
    }
  } else {
    res.status(401).json({ message: "Invalid or missing token", state: false });
  }
};

// Checks the `blockStatus` of a user.
const checkBlockState = (status) => {
  if (!status.isBlocked) return status;

  // If current date is past the block expiration, unblock the user
  if (Date.now() >= status.to) {
    status.isBlocked = false;
  }
  return status;
};

export default { authTokenCheck, isAdmin, checkUser };
