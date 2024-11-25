import participationService from "../services/participationService.js";
import RequestParticipation from "../models/requestParticipationModel.js";

// Approve or reject participation
const statusParticipation = async (req, res) => {
  try {
    const { requestParticipationId } = req.params;
    const { status } = req.body;
    const userId = req.user.id; // Extracted from token by middleware

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Allowed values are 'approved' or 'rejected'.",
        state: false,
      });
    }

    // Fetch the requestParticipation and populate event details
    const request = await RequestParticipation.findById(
      requestParticipationId
    ).populate("event");
    if (!request) {
      return res.status(404).json({
        message: "Participation request not found.",
        state: false,
      });
    }

    // Check if the user making the request is the event organizer
    const isEventOrganizer = String(request.event.createdBy) === userId;

    if (!isEventOrganizer) {
      return res.status(403).json({
        message:
          "Unauthorized action. Only the event organizer can approve or reject participation requests.",
        state: false,
      });
    }

    // Proceed with approval or rejection logic
    if (status === "approved") {
      const result = await participationService.approveParticipationService(
        requestParticipationId
      );
      return res
        .status(200)
        .json({
          message: "Participation request approved.",
          result,
          state: true,
        });
    } else if (status === "rejected") {
      const result = await participationService.rejectParticipationService(
        requestParticipationId
      );
      return res
        .status(200)
        .json({
          message: "Participation request rejected.",
          result,
          state: true,
        });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message, state: false });
  }
};

// Get all participations
const getAllParticipations = async (req, res) => {
  try {
    const participations =
      await participationService.getAllParticipationsService();
    return res.status(200).json({
      message: "Participations fetched successfully",
      participations,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// Get participation by ID
const getParticipationById = async (req, res) => {
  try {
    const { participationId } = req.params;
    const participation =
      await participationService.getParticipationByIdService(participationId);
    return res.status(200).json({
      message: "Participation fetched successfully",
      participation,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const cancelParticipation = async (req, res) => {
  try {
    const { participationId } = req.params;
    const userId = req.user.id;

    // Call the service to cancel the participation
    const response = await participationService.cancelParticipationService(
      participationId,
      userId
    );

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export default {
  statusParticipation,
  getAllParticipations,
  getParticipationById,
  cancelParticipation,
};
