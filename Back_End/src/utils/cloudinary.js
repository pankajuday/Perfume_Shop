import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config()
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadOnCloudinary = async function (localFilePath) {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
      folder: process.env.CLOUDINARY_ASSETS_FOLDER,
    });
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    if (error) {
      fs.unlinkSync(localFilePath);
      return error;
    }
  }
};

const deleteFromCloudinary = async function (publicUrl, options) {
  try {
    const publicId = publicUrl.slice(publicUrl.lastIndexOf('/') + 1, publicUrl.lastIndexOf('.'));
    const response = await cloudinary.uploader.destroy(publicId, options);
    return response;
  } catch (error) {
    return error;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
