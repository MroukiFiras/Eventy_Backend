import participationService from "../services/participationService.js";
import RequestParticipation from "../models/requestParticipationModel.js";

// Approve or reject participation
const statusParticipation = async (req, res) => {
  try {
    const { requestParticipationId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Allowed values are 'approved' or 'rejected'.",
        state: false,
      });
    }

    const request = await RequestParticipation.findById(
      requestParticipationId
    ).populate("event");
    if (!request) {
      return res.status(404).json({
        message: "Participation request not found.",
        state: false,
      });
    }

    if (String(request.event.createdBy) !== userId) {
      return res.status(403).json({
        message:
          "Only the event organizer can approve or reject participation requests.",
        state: false,
      });
    }

    const serviceMethod =
      status === "approved"
        ? participationService.approveParticipationService
        : participationService.rejectParticipationService;

    const result = await serviceMethod(requestParticipationId);

    return res.status(200).json({
      message: `Participation request ${status}.`,
      result,
      state: true,
    });
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

// Cancel participation
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

// Verify check in
const verifyCheckIn = async (req, res) => {
  try {
    const { qrCodeData } = req.body;
    const currentUserId = req.user.id;

    if (!qrCodeData) {
      return res.status(400).json({
        message: "QR code data is required",
        state: false,
      });
    }

    // Call the service to verify the check-in
    const result = await participationService.verifyCheckInService(
      qrCodeData,
      currentUserId
    );

    return res.status(200).json({
      message: result.message,
      userId: result.userId,
      eventId: result.eventId,
      timestamp: result.timestamp,
      state: true,
    });
  } catch (error) {
    console.error("Check-in verification error:", error);
    return res.status(500).json({
      message: error.message || "An error occurred during check-in",
      state: false,
    });
  }
};

// Get all participated events
const getParticipatedEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const events = await participationService.getParticipatedEventsService(
      userId
    );

    if (!events || events.length === 0) {
      return res.status(404).json({
        message:
          "No participated events found. You have not participated in any events yet.",
      });
    }

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};  

export default {
  statusParticipation,
  getAllParticipations,
  getParticipationById,
  cancelParticipation,
  verifyCheckIn,
  getParticipatedEvents,
};
