import { v2 as cloudinary } from "cloudinary";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

cloudinary.config({
  cloud_name: "dtjmo71kw",
  api_key: "587658687963397",
  api_secret: "LtL1OUc5deCkKnJZfavvuRGdrn4",
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const uniqueId = uuidv4();
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      public_id: uniqueId,
    });
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    // console.log(response);
    return {
      ...response,
      url: response.secure_url, // Ensure the URL is in HTTPS format
    };
  } catch (error) {
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteFromCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;
    const result = await cloudinary.uploader.destroy(filePath);
    console.log(result);
    return result;
  } catch (error) {
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
