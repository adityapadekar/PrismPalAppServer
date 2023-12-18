// Importing packages
const { UnauthorizedError } = require("../errors");
const jwt = require("jsonwebtoken");

/**
 * Middleware for authenticating requests.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {UnauthorizedError} If no token is provided or if the token is invalid.
 */
module.exports.authenticationMiddleware = async (req, res, next) => {
    // Get the Authorization header from the request
    const authHeader = req.headers.authorization;

    // Check if the Authorization header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedError("No token provided");
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(" ")[1];

    try {
        // Verify the token using the JWT_SECRET environment variable
        const payload = jwt.verify(token, process.env.JWT_STRING);

        // Set the user information in the request object
        req.credentials = {
            userId: payload?.userId,
            username: payload?.username,
            email: payload?.email,
        };

        // Call the next middleware function
        next();
    } catch (err) {
        throw new UnauthorizedError("Not authorized to access this route");
    }
};
