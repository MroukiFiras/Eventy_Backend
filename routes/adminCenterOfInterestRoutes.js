import express from "express";
import adminCenterOfInterestController from "../controllers/adminCenterOfInterestController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create center of interest route (admin only)
router.post("/create", adminCenterOfInterestController.createCenterOfInterest);

// Get all centers of interest route (admin only)
router.get("/", adminCenterOfInterestController.getAllCenters);

// Update center of interest route (admin only)
router.put(
  "/:centerId",
  adminCenterOfInterestController.updateCenterOfInterest
);

// Delete center of interest (admin only)
router.delete(
  "/:centerId",
  adminCenterOfInterestController.deleteCenterOfInterest
);

export default router;
