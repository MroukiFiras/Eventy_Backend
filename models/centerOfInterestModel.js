import mongoose from "mongoose";

const centerOfInterestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CenterOfInterest = mongoose.model(
  "CenterOfInterest",
  centerOfInterestSchema
);

export default CenterOfInterest;
