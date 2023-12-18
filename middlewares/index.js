// Import the Middleware modules
const { errorHandlerMiddleware } = require("./error-handler");
const { pageNotFound } = require("./page-not-found");
const { authenticationMiddleware } = require("./authentication");
const { userExist } = require("./user-exist");
const { isVerified } = require("./is-verified");

// Export the Middleware modules as an object
module.exports = {
    pageNotFound, // Middleware to Handles requests for route that does not exist
    errorHandlerMiddleware, // Middleware to handle errors
    authenticationMiddleware, // Middleware for authenticating requests
    userExist, // Middleware to check if user exists
    isVerified, // Middleware to check if user is verified
};
