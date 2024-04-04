const cloudinary = require('cloudinary').v2;

// Your existing configuration...

async function uploadImage(imageBase64) {
    try {
        // Uploading the image
        const result = await cloudinary.uploader.upload(imageBase64);
        
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

// import { v2 as cloudinary } from 'cloudinary';

// // Your existing configuration...

// async function uploadImage(imageBase64) {
//     try {
//         // Uploading the image with an upload preset
//         const result = await cloudinary.uploader.upload(imageBase64, {
//             upload_preset: 'k4kqkqbu'
//         });
        
//         // Returning the URL of the uploaded image
//         return result.url;

//     } catch (error) {
//         console.error('Upload to Cloudinary failed:', error.message);
//         if (error.response) {
//             console.error('Response:', error.response);
//         }
//         throw error;
//     }
// }

// export default {
//     uploadImage
// };
