import CenterOfInterest from "../models/centerOfInterestModel.js";

// Admin creates a center of interest
const createCenterOfInterestService = async (name, description) => {
  const existingCenter = await CenterOfInterest.findOne({ name });
  if (existingCenter) {
    throw new Error("Center of Interest already exists.");
  }

  const newCenter = new CenterOfInterest({
    name,
    description,
  });

  await newCenter.save();

  return newCenter;
};

// Admin gets all centers of interest
const getAllCentersService = async () => {
  return await CenterOfInterest.find();
};

// Update Center of Interest
const updateCenterOfInterestService = async (centerId, name, description) => {
  const center = await CenterOfInterest.findById(centerId);
  if (!center) {
    throw new Error("Center of Interest not found.");
  }

  // Update the center of interest details
  center.name = name || center.name;
  center.description = description || center.description;

  await center.save();
  return center;
};

// Admin deletes a center of interest
const deleteCenterOfInterestService = async (centerId) => {
  const center = await CenterOfInterest.findById(centerId);
  if (!center) throw new Error("Center of Interest not found.");

  await center.deleteOne();
  return { message: "Center of Interest deleted successfully." };
};

export default {
  createCenterOfInterestService,
  getAllCentersService,
  updateCenterOfInterestService,
  deleteCenterOfInterestService,
};
