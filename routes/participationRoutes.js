import express from "express";
import participationController from "../controllers/participationController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// get all the participated events route
router.get(
  "/participatedEvents",
  authMiddleware.authTokenCheck,
  participationController.getParticipatedEvents
);

// Get all participations route
router.get("/all", participationController.getAllParticipations);

// Get a participation by ID route
router.get("/:participationId", participationController.getParticipationById);

// Approve/reject participation request
router.patch(
  "/:requestParticipationId/status",
  authMiddleware.authTokenCheck,
  participationController.statusParticipation
);

// Delete a participation route
router.delete(
  "/cancel/:eventId",
  authMiddleware.authTokenCheck,
  participationController.cancelParticipation
);

// Check in route
router.post(
  "/checkIn",
  authMiddleware.authTokenCheck,
  participationController.verifyCheckIn
);

export default router;
