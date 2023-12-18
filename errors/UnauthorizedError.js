// Importing packages
const CustomAPIError = require("./CustomAPIError");
const { StatusCodes } = require("http-status-codes");

/**
 * Represents an UnauthorizedError.
 * @extends CustomAPIError
 */
class UnauthorizedError extends CustomAPIError {
    /**
     * Creates an instance of UnauthorizedError.
     * @param {string} message - The error message.
     */
    constructor(message) {
        // Call the parent class constructor
        super(message);

        // Set the status code to UNAUTHORIZED
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}

module.exports = UnauthorizedError;
