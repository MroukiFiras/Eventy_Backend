import eventService from "../services/eventService.js";
import mongoose from "mongoose";

// Handle the creation of a new event
const createEvent = async (req, res) => {
  try {
    // Extract event data from the request body
    const eventData = req.body;

    // If there's an image file, it will be uploaded, otherwise, we just skip it
    const imageFile = req.file ? req.file : null;

    // Call the event service to create the event and upload the image (if any)
    const newEvent = await eventService.createEventService(
      eventData,
      imageFile
    );

    // Return the newly created event in the response
    return res.status(201).json({
      message: "Event created successfully",
      eventId: newEvent._id,
      title: newEvent.title,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error creating event",
      error: error.message || error,
    });
  }
};

// Update Event
const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const eventData = req.body;
    const imageFile = req.file;

    const updatedEvent = await eventService.updateEventService(
      eventId,
      eventData,
      imageFile
    );

    return res.status(200).json({
      message: "Event updated successfully",
      eventId: updatedEvent._id,
      title: updatedEvent.title,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error updating event", error: error.message });
  }
};

// Get All Events
const getAllEvents = async (req, res) => {
  try {
    const events = await eventService.getAllEventsService();
    return res.status(200).json(events);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error fetching events", error: error.message });
  }
};

// Get Event by ID
const getEventById = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const event = await eventService.getEventByIdService(eventId);
    return res.status(200).json(event);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error fetching event", error: error.message });
  }
};

// Delete Event
const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const deletedEvent = await eventService.deleteEventService(eventId);

    return res.status(200).json({
      message: "Event deleted successfully",
      eventId: deletedEvent._id,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error deleting event", error: error.message });
  }
};

// Search events by name
const searchEventsByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        message: "Event name is required to perform a search",
      });
    }

    const events = await eventService.searchEventsByNameService(name);

    if (events.length === 0) {
      return res.status(404).json({
        message: "No events found with the given name",
      });
    }

    return res.status(200).json({
      message: "Events retrieved successfully",
      events,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error searching events",
      error: error.message || error,
    });
  }
};

// Get events by category
const getEventsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        message: "Invalid category ID format",
      });
    }

    const events = await eventService.getEventsByCategoryService(categoryId);

    if (events.length === 0) {
      return res.status(404).json({
        message: "No events found for this category",
      });
    }

    return res.status(200).json(events);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error fetching events by category",
      error: error.message || error,
    });
  }
};

export default {
  createEvent,
  updateEvent,
  getAllEvents,
  getEventById,
  deleteEvent,
  searchEventsByName,
  getEventsByCategory,
};
