import express from "express";
import authController from "../controllers/authController.js";
const router = express.Router();

// Signup route
router.post("/signup", authController.createUserController);
// Login route
router.post("/login", authController.loginUserController);
// Logout route
router.post("/logout", authController.logoutUser);

export default router;
