const CustomAPIError = require("./CustomAPIError");
const BadRequestError = require("./BadRequestError");
const NotFoundError = require("./NotFoundError");
const UnauthorizedError = require("./UnauthorizedError");
const InternalServerError = require("./InternalServerError");

module.exports = {
    CustomAPIError,
    BadRequestError,
    NotFoundError,
    UnauthorizedError,
    InternalServerError,
};
