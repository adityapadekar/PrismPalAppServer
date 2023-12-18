// Importing packages
const CustomAPIError = require("./CustomAPIError");
const { StatusCodes } = require("http-status-codes");

/**
 * Represents an NotFoundError.
 * @extends CustomAPIError
 */
class NotFoundError extends CustomAPIError {
    /**
     * Creates an instance of NotFoundError.
     * @param {string} message - The error message.
     */
    constructor(message) {
        // Call the parent class constructor
        super(message);

        // Set the status code to NOT_FOUND
        this.statusCode = StatusCodes.NOT_FOUND;
    }
}

module.exports = NotFoundError;
