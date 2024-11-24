import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  dateTime: {
    dates: {
      type: [Date], // Ensure this is an array of Date objects
      required: true,
    },
    times: {
      type: [String], // Ensure this is an array of strings for time
      required: true,
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  eventProfile: {
    type: String,
    required: true,
  },
  location: {
    type: String, 
    required: true,
  },
  maxParticipants: {
    type: Number,
    required: true,
  },
  category: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  centerOfInterest: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CenterOfInterest",
      required: true,
    },
  ],
  price: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
    enum: ["TND", "USD", "EUR"],
    default: "TND",
  },
  notifications: {
    reminders: { type: Boolean, default: true },
    updates: { type: Boolean, default: true },
  },
  status: {
    type: String,
    enum: ["upcoming", "ongoing", "completed", "canceled"],
    default: "upcoming",
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Participation",
    },
  ],
});

const Event = mongoose.model("Event", eventSchema);
export default Event;
