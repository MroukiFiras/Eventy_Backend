import express from "express";
import eventController from "../controllers/eventController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import image from "../services/imageService.js";

const router = express.Router();

// Get events user has NOT participated in or sent requests for route
router.get(
  "/availableEvents",
  authMiddleware.authTokenCheck,
  eventController.getAvailableEvents
);

// Get event by name route
router.get("/search", eventController.searchEventsByName);

// Get Events by Category route
router.get("/category/:categoryId", eventController.getEventsByCategory);

// Get all events organized by the logged-in user route
router.get(
  "/organized",
  authMiddleware.authTokenCheck,
  eventController.getAllOrganizedEvents
);

// Get the organizer of a specific event route
router.get("/organizer/:eventId", eventController.getEventOrganizer);

// Create event route
router.post(
  "/createEvent",
  authMiddleware.authTokenCheck,
  image.upload("image"),
  eventController.createEvent
);

// Update event route
router.put(
  "/updateEvent/:eventId",
  image.upload("image"),
  eventController.updateEvent
);

// Get ell events route
router.get("/allEvents", eventController.getAllEvents);

// Get event by id route
router.get("/:eventId", eventController.getEventById);

// Delete event route
router.delete(
  "/deleteEvent/:eventId",
  authMiddleware.authTokenCheck,
  eventController.deleteEvent
);

export default router;
