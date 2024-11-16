import express from "express";
import eventController from "../controllers/eventController.js";
import image from "../services/imageService.js";

const router = express.Router();

// Create Event
router.post("/createEvent", image.upload("image"), eventController.createEvent);

// Update Event
router.put(
  "/updateEvent/:eventId",
  image.upload("image"),
  eventController.updateEvent
);

// Get All Events
router.get("/allEvents", eventController.getAllEvents);

// Get Event by ID
router.get("/:eventId", eventController.getEventById);

// Delete Event
router.delete("/delete/:eventId", eventController.deleteEvent);

export default router;
