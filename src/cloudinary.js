const cloudinary = require('cloudinary').v2;

// Your existing configuration...

async function uploadImage(imageBase64) {
    try {
        const timestamp = Math.round((new Date()).getTime() / 1000);

        // Use Cloudinary's API to generate the signature
        const signaturePayload = {
            timestamp: timestamp,
            // Include any other parameters you want to send for the upload
        };

        // Generating the signature
        const signatureResult = cloudinary.utils.api_sign_request(signaturePayload, process.env.CLOUDINARY_API_SECRET);

        // Constructing parameters for the upload, including the generated signature
        const params = {
            ...signaturePayload,
            api_key: process.env.CLOUDINARY_API_KEY,
            signature: signatureResult
        };

        // Uploading the image
        const result = await cloudinary.uploader.upload(imageBase64, params);
        
        // Returning the URL of the uploaded image
        return result.url;

    } catch (error) {
        console.error('Upload to Cloudinary failed:', error);
        throw error;
    }
}
