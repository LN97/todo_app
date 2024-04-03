const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

async function uploadImage(image) {
    try {
        // Use await to wait for the promise to resolve
        const result = await cloudinary.uploader.upload(image, {
            folder: 'todoapp', // optional: specify folder name
        });
        // Once the upload is successful, return the URL
        return result.url;
    } catch (error) {
        console.error('Upload to Cloudinary failed:', error);
        throw error; // Rethrowing the error to be caught by the caller
    }
}

module.exports = {
    uploadImage
}