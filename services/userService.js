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

export default {
  uploadProfileImageService,
};
