import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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
  userRole: {
    user: { type: Boolean, default: true },
    admin: { type: Boolean, default: false },
  },
});

const User = mongoose.model("User", userSchema);

export default User;
