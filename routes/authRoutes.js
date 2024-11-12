import express from "express";
import authController from "../controllers/authController.js";
import authService from "../services/authService.js";
const router = express.Router();

// Route to create a new user
router.post("/signup", authController.createUser);

// Route to log in the user
router.post("/login", authController.loginUser);

// Route to resend verification code using userId (retrieved from auth token)
router.post("/resendVerification/user", authController.resendVerificationCode);

// Route to resend verification code using email
router.post("/resendVerification/email", authController.resendVerificationCode);

// Route to verify the email token
router.post("/verify", authController.verifyToken);

// Route to log out the user
router.post("/logout", authController.logoutUser);

export default router;
