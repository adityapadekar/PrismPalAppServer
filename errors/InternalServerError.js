// Importing packages
const CustomAPIError = require("./CustomAPIError");
const { StatusCodes } = require("http-status-codes");

/**
 * Represents an InternalServerError.
 * @extends CustomAPIError
 */
class InternalServerError extends CustomAPIError {
    /**
     * Creates an instance of InternalServerError.
     * @param {string} message - The error message.
     */
    constructor(message) {
        // Call the parent class constructor
        super(message);

        // Set the status code to INTERNAL_SERVER_ERROR
        this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }
}

module.exports = InternalServerError;
