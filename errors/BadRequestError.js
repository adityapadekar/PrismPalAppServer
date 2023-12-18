// Importing packages
const CustomAPIError = require("./CustomAPIError");
const { StatusCodes } = require("http-status-codes");

/**
 * Represents an BadRequestError.
 * @extends CustomAPIError
 */
class BadRequestError extends CustomAPIError {
    /**
     * Creates an instance of BadRequestError.
     * @param {string} message - The error message.
     */
    constructor(message) {
        // Call the parent class constructor
        super(message);

        // Set the status code to BAD_REQUEST
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

module.exports = BadRequestError;
