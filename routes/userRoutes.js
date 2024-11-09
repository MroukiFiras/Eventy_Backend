import express from "express";
import userController from "../controllers/userController.js";
import image from "../services/imageService.js";

const router = express.Router();

// Upload Image route
router.post(
  "/uploadProfileImage",
  image.upload("  "),
  userController.uploadProfileImage
);

export default router;
