import mongoose from "mongoose";

const requestParticipationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    requestDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const RequestParticipation = mongoose.model(
  "RequestParticipation",
  requestParticipationSchema
);

export default RequestParticipation;