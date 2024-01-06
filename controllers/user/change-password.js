const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const User = require("../../models/user");
const { BadRequestError } = require("../../errors");

module.exports.changePassword = async (req, res) => {
    const { newPassword, oldPassword } = req.body;
    const user = req.user;

    if (!newPassword || !oldPassword) {
        throw new BadRequestError(
            "Please provide required fields:  newPassword, oldPassword"
        );
    }

    if (!user.checkPassword(oldPassword)) {
        throw new BadRequestError("Old password is incorrect");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(
        user._id,
        { password: hashedPassword },
        { new: true }
    );

    return res.status(StatusCodes.OK).json({
        msg: "Password reset successfully",
        status: true,
    });
};
