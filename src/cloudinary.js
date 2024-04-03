const cloudinary = require('cloudinary').v2;
const sha1 = require('sha1');

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

async function uploadImage(imageBase64) {
    try {
        // Ensure your timestamp is consistent across signature generation and the parameters
        const timestamp = Math.round((new Date()).getTime() / 1000);

        // Generate the signature using the sorted parameter string
        const paramsToSign = `folder=todoapp&timestamp=${timestamp}${cloudinary.config().api_secret}`;
        const signature = sha1(paramsToSign);

        // Construct the full set of parameters for the upload
        const params = {
            timestamp,
            folder: 'todoapp',
            signature,
            api_key: process.env.CLOUDINARY_API_KEY // Include the API Key here as well
        };

        // Directly await the promise returned by the upload method
        const result = await cloudinary.uploader.upload(imageBase64, params);

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