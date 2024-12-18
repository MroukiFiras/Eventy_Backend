import express from "express";
import userController from "../controllers/userController.js";
import image from "../services/imageService.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get user by ID route
router.get("/getUserById/:id", userController.getUserById);

//
router.get("/getUserByEmail", userController.getUserByEmail);

// Upload Image route
router.post(
  "/uploadProfileImage",
  authMiddleware.checkUser,
  image.upload("image"),
  userController.uploadProfileImage
);

// Update user profile route
router.put(
  "/editProfile",
  authMiddleware.checkUser,
  image.upload("image"),
  userController.editUserProfile
);

export default router;
