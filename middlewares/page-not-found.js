// Importing packages
const { StatusCodes } = require("http-status-codes");

/**
 * Middleware to Handles requests for route that does not exist.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
// eslint-disable-next-line no-unused-vars
module.exports.pageNotFound = async (req, res, next) => {
    // Set the status code to 404 and send JSON response
    res.status(StatusCodes.NOT_FOUND).json({
        msg: "Route does not exist",
        status: false,
    });
};
