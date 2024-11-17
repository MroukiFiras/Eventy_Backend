import participationService from "../services/participationService.js";

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
  getAllParticipations,
  getParticipationById,
  cancelParticipation,
};
