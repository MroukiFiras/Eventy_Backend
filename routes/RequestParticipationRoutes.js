import express from "express";
import RequestParticipationController from "../controllers/RequestParticipationController.js";

const router = express.Router();

// Send a participation request route
router.post("/sendRequest/:eventId", RequestParticipationController.sendRequest);

// Get all the participation request route
router.get(
  "/allRequestes/:eventId",
  RequestParticipationController.GetAllRequestes
);

// Cancel the the participation request route
router.delete("/cancelRequest/:requestId", RequestParticipationController.CancelRequest);

// Handle the request approval or rejection route
router.patch(
  "/handleRequest/:requestId",
  RequestParticipationController.handleRequestApproval
);

export default router;
