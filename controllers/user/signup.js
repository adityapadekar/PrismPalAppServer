const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const VerificationToken = require("../../models/verification-token");
const { BadRequestError, InternalServerError } = require("../../errors");
const { sendResetEmailMail } = require("../../utils/email");
const { cloudinary } = require("../../utils/cloudinary");

module.exports.signUp = async (req, res) => {
    const { name, username, email, password, pic } = req.body;

    if (!name || !username || !email || !password) {
        throw new BadRequestError(
            "Please provide required fields: name, username, email, password"
        );
    }

    const user = await User.findOne({
        $or: [{ username: username }, { email: email }],
    });

    if (user && user.isVerified) {
        throw new BadRequestError(
            "The provided email or username is already taken"
        );
    }

    if (user && !user.isVerified) {
        const deletedProfile = await User.findByIdAndDelete(user._id);
        if (!deletedProfile) {
            throw new InternalServerError(
                "Something went wrong! Please try again later.."
            );
        }

        if (
            deletedProfile.profilePicture.publicId.startsWith("chat-app/users/")
        ) {
            const result = await cloudinary.uploader.destroy(
                deletedProfile.image.publicId
            );

            if (result.result === "not found" || result.result !== "ok") {
                throw new InternalServerError("Try again later");
            }
        }

        await VerificationToken.findOneAndDelete({ userId: user._id });
    }

    const profilePicture = {
        url: undefined,
        public_id: undefined,
    };

    if (pic) {
        const result = await cloudinary.uploader.upload(pic, {
            folder: "chat-app/users",
            width: 150,
            crop: "scale",
        });

        if (!result || !result.public_id || !result.secure_url) {
            throw new InternalServerError("Unable to upload image");
        }

        profilePicture.url = result.secure_url;
        profilePicture.public_id = result.public_id;
    }

    const newUser = await User.create({
        name: name,
        username: username,
        email: email,
        password: password,
        profilePicture: profilePicture,
    });

    const hash = crypto.randomBytes(32).toString("hex");

    const encodedToken = jwt.sign(
        { id: newUser._id, hash: hash },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h",
        }
    );

    await VerificationToken.create({
        userId: newUser._id,
        hash: hash,
    });

    const emailSubject = "Email verification";
    const emailBody = `Please click on the link below to verify your email address: ${process.env.FRONTEND_BASE_URL}/email-verification?token=${encodedToken}`;
    await sendResetEmailMail(email, emailSubject, emailBody);

    res.status(StatusCodes.CREATED).json({
        msg: "Signup Successful",
        status: true,
    });
};
