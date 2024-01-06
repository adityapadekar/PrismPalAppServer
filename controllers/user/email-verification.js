const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const VerificationToken = require("../../models/verification-token");
const { NotFoundError, BadRequestError } = require("../../errors");

module.exports.userEmailVerification = async (req, res) => {
    const { token } = req.params;

    if (!token) {
        throw new BadRequestError("Invalid token");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { id, hash } = decodedToken;

    const user = await User.findById(id);

    if (!user) {
        throw new NotFoundError("Invalid token");
    }

    const verificationToken = await VerificationToken.findOne({
        userId: user._id,
    });

    if (!verificationToken) {
        throw new NotFoundError("Invalid token");
    }

    if (verificationToken.hash !== hash) {
        throw new BadRequestError("Invalid token");
    }

    await User.updateOne({ _id: user._id }, { isVerified: true });

    await VerificationToken.deleteOne({
        userId: user._id,
    });

    res.status(StatusCodes.OK).json({
        msg: "Email verified successfully",
        status: true,
    });
};
