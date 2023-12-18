// Importing packages
const mongoose = require("mongoose");

// Importing error classes
const { InternalServerError } = require("../errors");

/**
 * Connects to the database using the provided URL.
 * @param {string} url - The URL of the database.
 */
module.exports.connectDB = async (url) => {
    // Connect to the database
    try {
        await mongoose.connect(url);
        console.log("Connected to DB"); // eslint-disable-line
    } catch (error) {
        // Print error message if unable to connect
        console.log(`Unable to connect \n\n ${error}`); // eslint-disable-line

        // Throw an error if unable to connect
        throw new InternalServerError("Unable to connect to database");
    }
};
