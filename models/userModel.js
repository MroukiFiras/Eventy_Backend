import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    gender: {
      type: String,
    },
    profileImage: {
      type: String,
      default:
        "https://res.cloudinary.com/db8sek2rg/image/upload/v1731014068/defaultAvatar.jpg",
    },
    hasVerifiedEmail: {
      type: Boolean,
      default: false,
    },
    tokenInfo: {
      token: { type: String, min: 6, max: 8 },
      tokenExpiration: { type: Date },
    },
    userRole: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    blockStatus: {
      isBlocked: { type: Boolean, default: false },
      blockedUntil: { type: Date, default: null },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
