// Importing packages
const { StatusCodes } = require("http-status-codes");

/**
 * Middleware to handle errors and send a custom error response.
 * @param {Error} err - The error object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */

// eslint-disable-next-line no-unused-vars
module.exports.errorHandlerMiddleware = async (err, req, res, next) => {
    // Create a customError object with default values
    let customError = {
        // Set the status code to the error's status code, or default to 500
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,

        // Set the error message to the error's message, or default to a generic message
        msg: err.message || "Something went wrong, Please try again",
    };

    // Send the custom error response
    return res
        .status(customError.statusCode)
        .json({ msg: customError.msg, status: false });
};
