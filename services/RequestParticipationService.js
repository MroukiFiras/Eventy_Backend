import requestParticipation from "../models/requestParticipationModel.js";
import eventService from "./eventService.js";
import Participation from "../models/participationModel.js";


// Sending participation request service
const sendRequestService = async (userId, eventId) => {
  const existingRequest = await requestParticipation.findOne({
    user: userId,
    event: eventId,
    status: "pending",
  });

  if (existingRequest) {
    throw new Error("You have already requested to join this event");
  }

  const request = await requestParticipation.create({
    user: userId,
    event: eventId,
    status: "pending",
  });

  return request;
};

// Fetch all requests service
const GetAllRequestesService = async (eventId) => {
  const requests = await requestParticipation
    .find({ event: eventId })
    .populate("user")
    .populate("event");
  return requests;
};

// Service method to cancel a user's participation request
const CancelRequestService = async (requestId) => {
  // Find the request by its ID
  const request = await requestParticipation.findById(requestId);

  if (!request) {
    throw new Error("Request not found");
  }

  // Ensure the request status is still pending before canceling
  if (request.status !== "pending") {
    throw new Error("You can only cancel pending requests");
  }

  // Delete the request from the database
  await requestParticipation.findByIdAndDelete(requestId);

  return { message: "Request has been deleted successfully" };
};

// Handle approval or rejection of participation request service
const handleRequestApprovalService = async (requestId, status) => {
  // Fetch the participation request
  const request = await requestParticipation
    .findById(requestId)
    .populate("event user");

  const event = request.event;

  // Check if max participants limit has been reached
  const isFull = await eventService.checkMaxParticipants(event._id);
  if (status === "approved" && isFull) {
    throw new Error(
      "Cannot approve request: Maximum participants limit reached"
    );
  }

  // Proceed with approval or rejection
  request.status = status;
  await request.save();

  if (status === "approved") {
    // Create the participation record
    const participation = await Participation.create({
      user: request.user._id,
      event: request.event._id,
      status: "approved",
    });

    // Add the user to the event's participants list
    event.participants.push(participation._id);
    await event.save();

    // Add the participation to the user's participatedEvents array
    const user = request.user;
    user.participatedEvents.push(participation._id);
    await user.save();

    // Delete the request from the requestParticipation collection
    await requestParticipation.findByIdAndDelete(requestId);

    return { message: "Request approved", participation };
  }

  if (status === "rejected") {
    // If the request is rejected, just delete the request
    await requestParticipation.findByIdAndDelete(requestId);
    return { message: "Request rejected and removed from records" };
  }
};


export default {
  sendRequestService,
  GetAllRequestesService,
  CancelRequestService,
  handleRequestApprovalService,
};
