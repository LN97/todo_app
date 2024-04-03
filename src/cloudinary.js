const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

async function uploadImage(imageBase64) {
    try {
        // Directly await the promise returned by the upload method
        const result = await cloudinary.uploader.upload(imageBase64);

        // Once the upload is successful, return the URL
        return result.url;

    } catch (error) {
        console.error('Upload to Cloudinary failed:', error);
        throw error; // Rethrowing the error to be caught by the caller
    }
}

module.exports = {
    uploadImage
};