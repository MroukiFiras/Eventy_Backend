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

export default {
  uploadProfileImage,
};
