import RequestParticipationService from "../services/RequestParticipationService.js";

// Sending participation request
const sendRequest = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { id: userId } = req.user;

    const request = await RequestParticipationService.sendRequestService(
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

    const requests = await RequestParticipationService.GetAllRequestesService(
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
    const response = await RequestParticipationService.CancelRequestService(
      requestId
    );

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// Get vents the user has sent participation requests for
const getRequestedEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const events = await RequestParticipationService.getRequestedEventsService(
      userId
    );

    if (!events || events.length === 0) {
      return res.status(404).json({
        message:
          "No requested events found. You have not sent requests for any events yet.",
      });
    }

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  sendRequest,
  GetAllRequestes,
  CancelRequest,
  getRequestedEvents,
};
