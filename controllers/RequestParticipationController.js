import requestParticipationService from "../services/requestParticipationService.js";

// Sending participation request
const sendRequest = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId } = req.body;

    const request = await requestParticipationService.sendRequestService(
      userId,
      eventId
    );
    return res.status(201).json({
      message: "Your request to participate has been sent successfully",
      request,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Get all participation requests for a specific event
const GetAllRequestes = async (req, res) => {
  try {
    const { eventId } = req.params;

    const requests = await requestParticipationService.GetAllRequestesService(
      eventId
    );
    return res
      .status(200)
      .json({ message: "Requests fetched successfully", requests });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const CancelRequest = async (req, res) => {
  try {
    const { requestId } = req.params; // Get requestId from the URL params

    // Call the service to cancel (delete) the request
    const response = await requestParticipationService.CancelRequestService(
      requestId
    );

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// Handle the request approval or rejection
const handleRequestApproval = async (req, res) => {
  try {
    const { requestId } = req.params; // Get requestId from URL
    const { status } = req.body; // Get status (approved or rejected) from the request body

    if (!["approved", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Invalid status. Must be 'approved' or 'rejected'" });
    }

    // Call the service to handle the approval/rejection
    const request =
      await requestParticipationService.handleRequestApprovalService(
        requestId,
        status
      );

    if (status === "approved") {
      return res.status(200).json({
        message:
          "Request has been approved and the user has been added to the event.",
        request,
      });
    } else {
      return res.status(200).json({
        message: "Request has been rejected.",
        request,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error processing the request",
      error: error.message,
    });
  }
};
export default {
  sendRequest,
  GetAllRequestes,
  CancelRequest,
  handleRequestApproval,
};
