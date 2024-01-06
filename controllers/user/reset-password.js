const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const VerificationToken = require("../../models/verification-token");
const { NotFoundError, BadRequestError } = require("../../errors");

module.exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { id, hash } = decodedToken;

    if (!newPassword) {
        throw new BadRequestError(
            "Please provide required fields:  newPassword"
        );
    }

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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(
        user._id,
        { password: hashedPassword },
        { new: true }
    );

    await VerificationToken.deleteOne({
        userId: user._id,
    });

    return res.status(StatusCodes.OK).json({
        msg: "Password reset successfully",
        status: true,
    });
};
