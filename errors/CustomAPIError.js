/**
 * Represents a custom API error.
 * @extends Error
 */
class CustomAPIError extends Error {
    /**
     * Constructs a new CustomAPIError instance.
     * @param {string} message - The error message.
     */
    constructor(message) {
        // Call the superclass constructor with the message parameter
        super(message);
    }
}

module.exports = CustomAPIError;
