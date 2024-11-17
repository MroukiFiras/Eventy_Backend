import Event from "../models/eventModel.js";
import User from "../models/userModel.js";
import imageService from "./imageService.js";

// Handle event creation service
const createEventService = async (eventData, imageFile) => {
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

  let eventProfileImageUrl = imageFile
    ? await uploadEventProfileImage(imageFile)
    : null;

  // Create a new event
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

  await newEvent.save();
  const user = await User.findById(createdBy);
  if (!user) {
    throw new Error("User not found.");
  }
  user.organizedEvents.push(newEvent._id);
  await user.save();

  return newEvent;
};

// Update Event Service
const updateEventService = async (eventId, eventData, imageFile) => {
  const event = await Event.findById(eventId);
  if (!event) throw new Error("Event not found");

  if (imageFile) {
    let eventProfileImageUrl = await uploadEventProfileImage(imageFile);
    event.eventProfile = eventProfileImageUrl; // Update event profile image if provided
  }

  Object.assign(event, eventData);

  await event.save();
  return event;
};

// Get All Events Service
const getAllEventsService = async () => {
  const events = await Event.find().sort({ createdAt: -1 });
  return events;
};

// Get Event by ID Service
const getEventByIdService = async (eventId) => {
  const event = await Event.findById(eventId);
  if (!event) throw new Error("Event not found");
  return event;
};

// Get All Events Organized by a User
const getAllOrganizedEventsService = async (userId) => {
  const events = await Event.find({ createdBy: userId }).sort({
    createdAt: -1,
  });
  return events;
};

// Get the User who Organized a Specific Event
const getEventOrganizerService = async (eventId) => {
  const event = await Event.findById(eventId);
  if (!event) throw new Error("Event not found");

  const user = await User.findById(event.createdBy);
  if (!user) throw new Error("User not found");

  return user;
};

const deleteEventService = async (eventId, userId) => {
  const event = await Event.findById(eventId);
  if (!event) throw new Error("Event not found");

  if (event.createdBy.toString() !== userId) {
    throw new Error("You are not authorized to delete this event.");
  }

  const user = await User.findById(userId);
  if (user) {
    user.organizedEvents = user.organizedEvents.filter(
      (eventObj) => eventObj.toString() !== eventId
    );
    await user.save();
  }
  await event.deleteOne();

  return event;
};

// Search events by name service
const searchEventsByNameService = async (eventName) => {
  const events = await Event.find({
    title: { $regex: new RegExp(eventName, "i") },
  });

  return events;
};

// Get events by category service
const getEventsByCategoryService = async (categoryId) => {
  const events = await Event.find({
    categories: categoryId,
  }).sort({ createdAt: -1 });
  return events;
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

// Check max participants service
const checkMaxParticipants = async (eventId) => {
  const event = await Event.findById(eventId);
  return event.participants.length >= event.maxParticipants;
};

export default {
  createEventService,
  updateEventService,
  getAllEventsService,
  getEventByIdService,
  getAllOrganizedEventsService,
  getEventOrganizerService,
  deleteEventService,
  searchEventsByNameService,
  getEventsByCategoryService,
  uploadEventProfileImage,
  checkMaxParticipants,
};
