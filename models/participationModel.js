import mongoose from "mongoose";

const participationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
    status: {
      type: String,
      enum: ["approved", "rejected"],
      default: "approved",
    },
    isCheckedIn: {
      type: Boolean,
      default: false,
    },
    checkInToken: {
      type: String,
      unique: true,
    },
    checkInTime: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Participation = mongoose.model("Participation ", participationSchema);

export default Participation;
