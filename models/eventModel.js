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
    dates: Array,
    times: Array,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  location: {
    latitude: Number,
    longitude: Number,
    location: String,
  },
  maxParticipants: {
    type: Number,
  },
  categories: {
    type: [String],
  },

  eventProfile: {
    type: String,
  },
  registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Event = mongoose.model("event", eventSchema);
export default Event;
