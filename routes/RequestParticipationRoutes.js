import express from "express";
import requestParticipationController from "../controllers/requestParticipationController.js";

const router = express.Router();

// Send a participation request route
router.post(
  "/sendRequest/:eventId",
  requestParticipationController.sendRequest
);

// Get all the participation request route
router.get(
  "/allRequestes/:eventId",
  requestParticipationController.GetAllRequestes
);

// Cancel the the participation request route
router.delete(
  "/cancelRequest/:requestId",
  requestParticipationController.CancelRequest
);

// Handle the request approval or rejection route
router.patch(
  "/handleRequest/:requestId",
  requestParticipationController.handleRequestApproval
);

export default router;
