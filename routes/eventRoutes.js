import express from "express";
import eventController from "../controllers/eventController.js";
import image from "../services/imageService.js";

const router = express.Router();

// Get event by name
router.get("/search", eventController.searchEventsByName);

// Get Events by Category
router.get("/category/:categoryId", eventController.getEventsByCategory);

// Create event
router.post("/createEvent", image.upload("image"), eventController.createEvent);

// Update event
router.put(
  "/updateEvent/:eventId",
  image.upload("image"),
  eventController.updateEvent
);

// Get ell events
router.get("/allEvents", eventController.getAllEvents);

// Get event by id
router.get("/:eventId", eventController.getEventById);

// Delete event
router.delete("/deleteEvent/:eventId", eventController.deleteEvent);

export default router;
