import express from "express";
import adminCenterOfInterestController from "../controllers/adminCenterOfInterestController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create center of interest route (admin only)
router.post(
  "/create",
  // authMiddleware.isAdmin,
  adminCenterOfInterestController.createCenterOfInterest
);


//  Get all centers of interest route (accessible to all authenticated users)
router.get(
  "/public/all",
  authMiddleware.authTokenCheck,
  adminCenterOfInterestController.getAllCenters
); 

// Get all centers of interest route (admin only)
router.get(
  "/",
  authMiddleware.isAdmin,
  adminCenterOfInterestController.getAllCenters
);

// Update center of interest route (admin only)
router.put(
  "/:centerId",
  authMiddleware.isAdmin,
  adminCenterOfInterestController.updateCenterOfInterest
);

// Delete center of interest (admin only)
router.delete(
  "/:centerId",
  authMiddleware.isAdmin,
  adminCenterOfInterestController.deleteCenterOfInterest
);

export default router;
