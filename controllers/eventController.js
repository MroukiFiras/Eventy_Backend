import eventService from "../services/eventService.js";

// Controller to handle the creation of a new event
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

// Update Event Controller
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

// Get All Events Controller
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

// Get Event by ID Controller
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

// Delete Event Controller
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

export default {
  createEvent,
  updateEvent,
  getAllEvents,
  getEventById,
  deleteEvent,
};
