/**
 * @module cloudinaryConfig
 * @description Necessary config for cloudinary to upload images to cloud
 */

// Importing packages
const cloudinary = require("cloudinary").v2;

// Configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

module.exports = { cloudinary };
