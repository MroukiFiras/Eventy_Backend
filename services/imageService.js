import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

// Setup Multer storage configuration
const upload = (fileName) => {
  var storage = multer.diskStorage({
    filename: function (_, file, callback) {
      callback(null, Date.now() + file.originalname);
    },
  });

  return multer({ storage: storage }).single("image");
};

// Upload image to Cloudinary with flexible folder naming
const uploadImage = async (filePath, { rootFolder, folder, name }) => {
  // Create the folder path for Cloudinary
  const folderPath = rootFolder ? `/${rootFolder}/${folder}` : `/${folder}`;

  const result = await cloudinary.uploader.upload(filePath, {
    folder: folderPath,
    public_id: name.split(".")[0] + "-" + Date.now().toString(),
  });

  return result.secure_url;
};

export default {
  upload,
  uploadImage,
};
