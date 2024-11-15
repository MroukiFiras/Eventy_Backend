import adminCenterOfInterestService from "../services/adminCenterOfInterestService.js";

// Create center of interest
const createCenterOfInterest = async (req, res) => {
  const { name, description } = req.body;

  try {
    const center =
      await adminCenterOfInterestService.createCenterOfInterestService(
        name,
        description
      );
    res.status(201).json(center);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all centers of interest
const getAllCenters = async (req, res) => {
  try {
    const centers = await adminCenterOfInterestService.getAllCentersService();
    res.status(200).json(centers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update center of interest
const updateCenterOfInterest = async (req, res) => {
  const { centerId } = req.params;
  const { name, description } = req.body;

  try {
    const updatedCenter =
      await adminCenterOfInterestService.updateCenterOfInterestService(
        centerId,
        name,
        description
      );
    res.status(200).json(updatedCenter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete center of interest
const deleteCenterOfInterest = async (req, res) => {
  const { centerId } = req.params;

  try {
    const response =
      await adminCenterOfInterestService.deleteCenterOfInterestService(
        centerId
      );
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export default {
  createCenterOfInterest,
  getAllCenters,
  updateCenterOfInterest,
  deleteCenterOfInterest,
};
