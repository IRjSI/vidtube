import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv"

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// Upload Video with HLS
const uploadVideoOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "video",
            eager_async: true,  // Process transformations asynchronously
            eager: [
                { streaming_profile: "auto", format: "m3u8" }
            ]
        });
        console.log("Video uploaded on Cloudinary (HLS ready)");
        fs.unlinkSync(localFilePath);

        return response;
    } catch (error) {
        console.error("Error uploading video:", error);
        if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);

        return null;
    }
};

// Upload Thumbnail (Image)
const uploadThumbnailOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "image"
        });

        console.log("Thumbnail uploaded on Cloudinary");
        fs.unlinkSync(localFilePath);

        return response;
    } catch (error) {
        console.error("Error uploading thumbnail:", error);
        if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);

        return null;
    }
};

const deleteFromCloudinary = async (publicId) => {
    try {
        const response = await cloudinary.uploader.destroy(publicId)
        console.log('Deleted from Cloudinary');
        
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export { uploadVideoOnCloudinary, uploadThumbnailOnCloudinary, deleteFromCloudinary };