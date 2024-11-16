import Event from "../models/eventModel.js";
import imageService from "./imageService.js";

// Service to handle event creation
const createEventService = async (eventData, imageFile) => {
  try {
    // Destructure the event data
    const {
      title,
      description,
      dateTime,
      createdBy,
      location,
      maxParticipants,
      categories,
      centerOfInterest,
    } = eventData;

    // Upload the event profile image if provided
    let eventProfileImageUrl = await uploadEventProfileImage(imageFile);

    // Create the new event object
    const newEvent = new Event({
      title,
      description,
      dateTime,
      createdBy,
      eventProfile: eventProfileImageUrl,
      location,
      maxParticipants,
      categories,
      centerOfInterest,
    });

    // Save the event to the database
    await newEvent.save();
    return newEvent;
  } catch (error) {
    throw new Error("Error creating event: " + error.message);
  }
};

// Update Event Service
const updateEventService = async (eventId, eventData, imageFile) => {
  try {
    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");

    if (imageFile) {
      let eventProfileImageUrl = await uploadEventProfileImage(imageFile);
      event.eventProfile = eventProfileImageUrl; // Update event profile image if provided
    }

    // Update event data
    Object.assign(event, eventData);

    await event.save();
    return event;
  } catch (error) {
    throw new Error("Error updating event: " + error.message);
  }
};

// Get All Events Service
const getAllEventsService = async () => {
  try {
    const events = await Event.find();
    return events;
  } catch (error) {
    throw new Error("Error fetching events: " + error.message);
  }
};

// Get Event by ID Service
const getEventByIdService = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");
    return event;
  } catch (error) {
    throw new Error("Error fetching event: " + error.message);
  }
};

// Delete Event Service
const deleteEventService = async (eventId) => {
  try {
    const event = await Event.findByIdAndDelete(eventId);
    if (!event) throw new Error("Event not found");
    return event;
  } catch (error) {
    throw new Error("Error deleting event: " + error.message);
  }
};

// Helper function to upload event profile image to Cloudinary
const uploadEventProfileImage = async (imageFile) => {
  if (!imageFile) throw new Error("Image file is required for event profile");

  const filePath = imageFile.path;
  const uploadedImageUrl = await imageService.uploadImage(filePath, {
    rootFolder: "events",
    folder: "profiles",
    name: imageFile.originalname,
  });

  return uploadedImageUrl;
};

export default {
  createEventService,
  updateEventService,
  getAllEventsService,
  getEventByIdService,
  deleteEventService,
  uploadEventProfileImage,
};
