import RequestParticipation from "../models/RequestParticipationModel.js";
import eventService from "./eventService.js";

// Sending participation request service
const sendRequestService = async (userId, eventId) => {
  const existingRequest = await RequestParticipation.findOne({
    user: userId,
    event: eventId,
    status: "pending",
  });

  if (existingRequest) {
    throw new Error("You have already requested to join this event");
  }

  const request = await RequestParticipation.create({
    user: userId,
    event: eventId,
    status: "pending",
  });

  return request;
};

// Fetch all requests service
const GetAllRequestesService = async (eventId) => {
  const requests = await RequestParticipation.find({ event: eventId })
    .populate("user")
    .populate("event");
  return requests;
};

// Service method to cancel a user's participation request
const CancelRequestService = async (requestId) => {
  // Find the request by its ID
  const request = await RequestParticipation.findById(requestId);

  if (!request) {
    throw new Error("Request not found");
  }

  // Ensure the request status is still pending before canceling
  if (request.status !== "pending") {
    throw new Error("You can only cancel pending requests");
  }

  // Delete the request from the database
  await RequestParticipation.findByIdAndDelete(requestId);

  return { message: "Request has been deleted successfully" };
};

// Handle approval or rejection of participation request service
const handleRequestApprovalService = async (requestId, status) => {
  // Fetch the participation request
  const request = await RequestParticipation.findById(requestId).populate(
    "event user"
  );

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
    event.participants.push(request.user);
    await event.save();
  }

  return request;
};

export default {
  sendRequestService,
  GetAllRequestesService,
  CancelRequestService,
  handleRequestApprovalService,
};
