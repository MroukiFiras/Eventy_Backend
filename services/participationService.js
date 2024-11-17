import Participation from "../models/participationModel.js";

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
  getAllParticipationsService,
  getParticipationByIdService,
  cancelParticipationService,
};
