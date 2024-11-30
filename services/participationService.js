import Participation from "../models/participationModel.js";
import RequestParticipation from "../models/requestParticipationModel.js";
import Event from "../models/eventModel.js";
import User from "../models/userModel.js";
import emailService from "./emailService.js";
import QRCode from "qrcode";

// Approve Participation Service
const approveParticipationService = async (requestParticipationId) => {
  const request = await RequestParticipation.findById(
    requestParticipationId
  ).populate("user event");

  if (!request) throw new Error("Participation request not found.");

  const { user, event } = request;

  const participantCount = await Participation.countDocuments({
    event: event._id,
  });
  if (participantCount >= event.maxParticipants) {
    throw new Error("Event has reached its maximum participant capacity.");
  }

  // Generate a QR code for event check-in
  const qrCodeData = `${user._id}-${event._id}-${Date.now()}`;
  const qrCodeUrl = await QRCode.toDataURL(qrCodeData);

  // Create Participation record
  const participation = await Participation.create({
    user: user._id,
    event: event._id,
    status: "approved",
    checkInToken: qrCodeData,
  });

  // Update user's participatedEvents
  await User.findByIdAndUpdate(user._id, {
    $addToSet: { participatedEvents: participation._id },
  });

  // Update event's participants
  await Event.findByIdAndUpdate(event._id, {
    $addToSet: { participants: participation._id },
  });

  // Send approval email
  await emailService.sendParticipationEmail(user, event, qrCodeUrl, "approved");

  // Remove requestParticipation entry
  await RequestParticipation.deleteOne({ _id: requestParticipationId });

  return participation;
};

// Reject Participation service
const rejectParticipationService = async (requestParticipationId) => {
  const request = await RequestParticipation.findById(
    requestParticipationId
  ).populate("user event");

  if (!request) throw new Error("Participation request not found.");
  const { user, event } = request;

  // Send rejection email
  await emailService.sendParticipationEmail(user, event, null, "rejected");

  // Remove requestParticipation entry
  await RequestParticipation.deleteOne({ _id: requestParticipationId });

  return {
    message: `Participation request for event ${event.title} was rejected.`,
    status: "rejected",
  };
};

// Get all participations service
const getAllParticipationsService = async () => {
  return await Participation.find().populate("user event");
};

// Get participation by ID service
const getParticipationByIdService = async (participationId) => {
  const participation = await Participation.findById(participationId).populate(
    "user event"
  );
  if (!participation) {
    throw new Error("Participation not found");
  }
  return participation;
};

// Cancel participation Service
const cancelParticipationService = async (participationId, userId) => {
  const participation = await Participation.findById(participationId).populate(
    "event"
  );

  if (!participation) {
    throw new Error("Participation record not found");
  }

  if (!participation.user.equals(userId)) {
    throw new Error(
      "Unauthorized: You can only cancel your own participation."
    );
  }

  const { event } = participation;

  // Remove participation record
  await Participation.findByIdAndDelete(participationId);

  // Update user's participatedEvents
  await User.findByIdAndUpdate(userId, {
    $pull: { participatedEvents: participationId },
  });

  // Update event's participants
  await Event.findByIdAndUpdate(event._id, {
    $pull: { participants: participationId },
  });

  return { message: "Participation has been canceled successfully" };
};

// Verify check in service
const verifyCheckInService = async (qrCodeData, currentUserId) => {
  const [userId, eventId, timestamp] = qrCodeData.split("-");

  if (!userId || !eventId || !timestamp) {
    throw new Error("Invalid QR code data");
  }

  // Verify event existence
  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  // Ensure the current user is the event creator
  if (event.createdBy.toString() !== currentUserId.toString()) {
    throw new Error(
      "Unauthorized: Only the event creator can perform the check-in."
    );
  }

  // Verify participation record
  const participation = await Participation.findOne({
    user: userId,
    event: eventId,
    checkInToken: qrCodeData, // Match the exact token including timestamp
  });
  if (!participation) {
    throw new Error("Participation record not found");
  }

  // Ensure user has not already checked in
  if (participation.isCheckedIn) {
    throw new Error("User has already checked in");
  }

  // Mark the user as checked in
  participation.isCheckedIn = true;
  participation.checkInTime = new Date();
  await participation.save();

  return {
    message: "Check-in successful",
    userId,
    eventId,
    timestamp: new Date(parseInt(timestamp)), // Return timestamp as Date
  };
};

// Get all participated events service
const getParticipatedEventsService = async (userId) => {
  const participations = await Participation.find({ user: userId }).populate("event");
  const events = participations.map((p) => p.event);
  return events;
};

export default {
  approveParticipationService,
  rejectParticipationService,
  getAllParticipationsService,
  getParticipationByIdService,
  cancelParticipationService,
  verifyCheckInService,
  getParticipatedEventsService,
};
