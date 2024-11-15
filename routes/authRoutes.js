import express from "express";
import authController from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import rateLimitMiddleware from "../middlewares/rateLimitMiddleware.js";
const router = express.Router();

// Route to create a new user
router.post("/signup", authController.createUser);

// Route to log in the user
router.post("/login", authController.loginUser);

// Route to resend verification code
router.post(
  "/verification/resend",
  authMiddleware.authTokenCheck,
  rateLimitMiddleware.rateLimit,
  authController.resendVerificationCode
);

// Route to request password reset
router.post("/passwordReset/request", authController.requestPasswordReset);

// Route to verify the password token
router.post(
  "/passwordReset/verifyToken",
  authController.verifyPasswordResetToken
);

// Route to resend password reset token
router.post(
  "/passwordReset/resendToken",
  authMiddleware.authTokenCheck,
  rateLimitMiddleware.rateLimit,
  authController.resendPasswordResetToken
);

// Route to reset password
router.post("/passwordReset", authController.resetPassword);

// Route to verify the email token
router.post("/verify", authController.verifyToken);

// Route to log out the user
router.post("/logout", authController.logoutUser);

export default router;
