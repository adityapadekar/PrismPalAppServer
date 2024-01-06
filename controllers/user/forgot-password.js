const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const VerificationToken = require("../../models/verification-token");
const { NotFoundError, BadRequestError } = require("../../errors");
const { sendResetEmailMail } = require("../../utils/email");

module.exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new BadRequestError("Email is required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new NotFoundError("No account with this email");
    }

    const hash = crypto.randomBytes(32).toString("hex");

    const encodedToken = jwt.sign(
        { id: user._id, hash: hash },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h",
        }
    );

    await VerificationToken.create({
        userId: user._id,
        hash: hash,
    });

    const emailSubject = "Reset Password";
    const emailBody = `Please click on the link below to reset your password: ${process.env.FRONTEND_BASE_URL}/reset-password?token=${encodedToken}`;
    await sendResetEmailMail(email, emailSubject, emailBody);

    res.status(StatusCodes.OK).json({
        msg: "Reset password email sent",
        status: true,
    });
};
