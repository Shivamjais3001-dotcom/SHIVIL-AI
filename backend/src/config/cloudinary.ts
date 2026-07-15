import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "shivil-cloud",
  api_key: process.env.CLOUDINARY_API_KEY || "12345",
  api_secret: process.env.CLOUDINARY_API_SECRET || "abcde",
});

export default cloudinary;
