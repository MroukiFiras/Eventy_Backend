import Image from "./imageService.js";
import User from "../models/userModel.js";

const uploadProfileImageService = async (user, file) => {
  const url = await Image.uploadImage(file.path, {
    rootFolder: "users",
    folder: `${user.name}-${user._id}`,
    name: file.originalname,
  });
  user.profileImage = url;
  await user.save();
  return user;
};

const editUserProfileService = async (userId, updates, file) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const allowedFields = [
    "name",
    "phone",
    "address",
    "gender",
    "centerOfInterest",
  ];
  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) {
      user[field] = updates[field];
    }
  });

  if (file) {
    const url = await Image.uploadImage(file.path, {
      rootFolder: "users",
      folder: `${user.name}-${user._id}`,
      name: file.originalname,
    });
    user.profileImage = url;
  }

  const updatedUser = await user.save();

  return updatedUser;
};

export default {
  uploadProfileImageService,
  editUserProfileService,
};
