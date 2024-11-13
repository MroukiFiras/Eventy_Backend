import express from "express";
import authController from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();

// Route to create a new user
router.post("/signup", authController.createUser);

// Route to log in the user
router.post("/login", authController.loginUser);

// Route to resend verification code
router.post(
  "/resendVerification",
  authMiddleware.authTokenCheck,
  authController.resendVerificationCode
);

router.post("/passwordReset", authController.requestPasswordReset);

// Route to verify the email token
router.post("/verify", authController.verifyToken);

// Route to log out the user
router.post("/logout", authController.logoutUser);

export default router;
