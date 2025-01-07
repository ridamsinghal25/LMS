import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
// import fs from "fs";

dotenv.config({});

// check and load env variables

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadMedia = async (file) => {
  try {
    if (!file) return null;
    // upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // fs.unlinkSync(file);

    return response;
  } catch (error) {
    console.log("error in while uploading media to cloudinary", error);
  }
};

export const deleteMediaFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log(error);
  }
};

export const deleteVideoFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
  } catch (error) {
    console.log(error);
  }
};
