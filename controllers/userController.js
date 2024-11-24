import userService from "../services/userService.js";

const uploadProfileImage = async (req, res) => {
  // console.log(req.file); // Log file to debug
  try {
    const user = req.user;
    const updatedUser = await userService.uploadProfileImageService(
      user,
      req.file
    );
    res.json({
      message: "Profile Picture Updated.",
      user: updatedUser,
      state: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, state: false });
  }
};

const editUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;
    const file = req.file;

    // Call the service to update the user profile
    const updatedUser = await userService.editUserProfileService(
      userId,
      updates,
      file
    );

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
      state: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, state: false });
  }
};

export default {
  uploadProfileImage,
  editUserProfile,
};
