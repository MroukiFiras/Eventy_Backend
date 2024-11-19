import express from "express";
import participationController from "../controllers/participationController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get all participations route
router.get("/all", participationController.getAllParticipations);

// Get a participation by ID route
router.get("/:participationId", participationController.getParticipationById);

// Delete a participation route
router.delete(
  "/cancel/:participationId",
  authMiddleware.authTokenCheck,
  participationController.cancelParticipation
);

export default router;
