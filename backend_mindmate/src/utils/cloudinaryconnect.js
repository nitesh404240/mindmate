import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload an image
const uploadOncloudinary = async (localfilepath) => {
  try {
    const response = await cloudinary.uploader.upload(localfilepath, {
      resource_type: "auto",
    });
    //console.log(response);
    //unlinking the file from local storage
    //fs.unlinkSync(localfilepath);
    return response;
  } catch (error) {
    console.error(" Upload to Cloudinary failed:", error);

    fs.unlinkSync(localfilepath);

    return null;
  }
};

 const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return null;
        
        // Use the destroy method
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Cloudinary deletion result:", result);

          
        return result;
    } catch (error) {
        console.error("Error deleting file from Cloudinary:", error);
        // Important: Log the error but do NOT throw an ApiError that stops the request, 
        // because the new image is already saved to the database.
        return null; 
    }
};

function getPublicIdFromUrl(url) {
  try {
    let afterUpload = url.split("/upload/")[1]; 
    if (!afterUpload) return null;

    // remove version
    afterUpload = afterUpload.replace(/^v[0-9]+\//, "");

    // remove extension .jpg/.png/etc
    afterUpload = afterUpload.replace(/\.[a-zA-Z0-9]+$/, "");

    return afterUpload; 
  } catch (err) {
    console.error("public_id extract error:", err);
    return null;
  }
}

export { uploadOncloudinary ,deleteFromCloudinary ,getPublicIdFromUrl};
