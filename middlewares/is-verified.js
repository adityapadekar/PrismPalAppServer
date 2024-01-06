const { UnauthorizedError } = require("../errors");

module.exports.isVerified = async (req, res, next) => {
    const { isVerified } = req.user;

    if (!isVerified) {
        throw new UnauthorizedError(
            "Not authorized to access this route! Unverified users can access this route."
        );
    }

    next();
};
