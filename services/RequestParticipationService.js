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




export default {
  sendRequestService,
  GetAllRequestesService,
  CancelRequestService,
  
};
