const cloudinary = require('cloudinary').v2;
  
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUDNAME, 
  api_key: process.env.CLOUDINARY_APIKEY, 
  api_secret: process.env.CLOUDINARY_APISECRET 
});

async function uploadImage(imageBase64) {
    try {
        // Uploading the image with an upload preset
        const result = await cloudinary.uploader.upload(imageBase64, {
            upload_preset: 'k4kqkqbu' // Specify the upload preset here
        });
        
        // Returning the URL of the uploaded image
        return result.url;

    } catch (error) {
        console.error('Upload to Cloudinary failed:', error);
        throw error;
    }
}

module.exports = {
    uploadImage
};