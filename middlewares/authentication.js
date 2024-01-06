const { UnauthorizedError } = require("../errors");
const jwt = require("jsonwebtoken");

module.exports.authenticationMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedError("No token provided");
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        req.credentials = {
            userId: payload?.userId,
            username: payload?.username,
            email: payload?.email,
        };

        next();
    } catch (err) {
        throw new UnauthorizedError("Not authorized to access this route");
    }
};
