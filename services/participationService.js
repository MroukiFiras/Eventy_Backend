import Participation from "../models/participationModel.js";
import RequestParticipation from "../models/requestParticipationModel.js";
import Event from "../models/eventModel.js";
import User from "../models/userModel.js";
import emailService from "./emailService.js";
import QRCode from "qrcode";

// Approve Participation service
const approveParticipationService = async (requestParticipationId) => {
  const request = await RequestParticipation.findById(requestParticipationId).populate("user event");

  if (!request) throw new Error("Participation request not found.");
  const { user, event } = request;

  // Generate a QR code for event check-in
  const qrCodeData = `${user._id}-${event._id}-${new Date().getTime()}`;
  const qrCodeUrl = await QRCode.toDataURL(qrCodeData);
  console.log(qrCodeUrl)
  // Create Participation record
  const participation = await Participation.create({
    user: user._id,
    event: event._id,
    status: "approved",
    checkInToken: qrCodeData,
  });

  // Save to user's participatedEvents
  const userData = await User.findById(user._id);
  if (!userData.participatedEvents.includes(participation._id)) {
    userData.participatedEvents.push(participation._id);
    await userData.save();
  }

  // Save to event's participants
  const eventData = await Event.findById(event._id);
  if (!eventData.participants.includes(participation._id)) {
    eventData.participants.push(participation._id);
    await eventData.save();
  }

  // Send approval email
  await emailService.sendParticipationEmail(user, event, qrCodeUrl, "approved");

  // Remove requestParticipation entry
  await RequestParticipation.deleteOne({ _id: requestParticipationId });

  return participation;
};

// Reject Participation service
const rejectParticipationService = async (requestParticipationId) => {
  const request = await RequestParticipation.findById(requestParticipationId).populate("user event");

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

const cancelParticipationService = async (participationId, userId) => {
  const participation = await Participation.findById(participationId).populate(
    "event"
  );
  if (!participation) {
    throw new Error("Participation record not found");
  }

  if (!participation.user.equals(userId)) {
    throw new Error("Unauthorized: You can only cancel your own participation");
  }

  await Participation.findByIdAndDelete(participationId);

  const event = participation.event;
  event.participants = event.participants.filter(
    (participantId) => !participantId.equals(participationId)
  );
  await event.save();

  return { message: "Participation has been canceled successfully" };
};

export default {
  approveParticipationService,
  rejectParticipationService,
  getAllParticipationsService,
  getParticipationByIdService,
  cancelParticipationService,
};
