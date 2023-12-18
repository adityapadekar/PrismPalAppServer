// Importing custom error classes
const CustomAPIError = require("./CustomAPIError");
const BadRequestError = require("./BadRequestError");
const NotFoundError = require("./NotFoundError");
const UnauthorizedError = require("./UnauthorizedError");
const InternalServerError = require("./InternalServerError");

// Exporting the error classes as an object
module.exports = {
    CustomAPIError, // Represents a custom API error
    BadRequestError, // Represents a bad request error
    NotFoundError, // Represents a not found error
    UnauthorizedError, // Represents an unauthorized error
    InternalServerError, // Represents an internal server error
};
