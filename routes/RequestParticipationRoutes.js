import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import RequestParticipationController from "../controllers/RequestParticipationController.js";
const router = express.Router();

// Send a participation request route
router.post(
  "/send/:eventId",
  authMiddleware.authTokenCheck,
  RequestParticipationController.sendRequest
);

// Get all the participation request route
router.get("/all/:eventId", RequestParticipationController.GetAllRequestes);

// Cancel the the participation request route
router.delete(
  "/cancel/:requestId",
  RequestParticipationController.CancelRequest
);

// Handle the request approval or rejection route
router.patch(
  "/handle/:requestId",
  RequestParticipationController.handleRequestApproval
);

export default router;