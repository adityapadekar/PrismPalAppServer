// Importing packages
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Importing the models
const User = require("../../models/user");
const EmailVerificationToken = require("../../models/email-verification");

// Importing custom error classes
const { BadRequestError, InternalServerError } = require("../../errors");

// Importing Utility functions
const { sendResetEmailMail } = require("../../utils/email");
const { cloudinary } = require("../../utils/cloudinary");

/**
 * Controller to handle the SignUp request
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @throws {BadRequestError} - If required fields are missing or user already exists
 */
module.exports.userSignUp = async (req, res) => {
    const { name, username, email, password, pic } = req.body;

    // Check if name, username, email, password, contactNumber, and address are provided
    if (!name || !username || !email || !password) {
        throw new BadRequestError(
            "Please provide required fields: name, username, email, password"
        );
    }

    // Find user with matching username or email
    const user = await User.findOne({
        $or: [{ username: username }, { email: email }],
    });

    // If user is found and is verified, throw an error
    if (user && user.isVerified) {
        throw new BadRequestError(
            "The provided email or username is already taken"
        );
    }

    // If user is found and is not verified, delete the user
    if (user && !user.isVerified) {
        const deletedProfile = await User.findByIdAndDelete(user._id);
        if (!deletedProfile) {
            throw new InternalServerError(
                "Something went wrong! Please try again later.."
            );
        }

        // Delete the old image from cloudinary
        if (
            deletedProfile.profilePicture.publicId.startsWith("chat-app/users/")
        ) {
            const result = await cloudinary.uploader.destroy(
                deletedProfile.image.publicId
            );

            // Throw an error if unable to delete the old image
            if (result.result === "not found" || result.result !== "ok") {
                throw new InternalServerError("Try again later");
            }
        }

        await EmailVerificationToken.findOneAndDelete({ userId: user._id });
    }

    let profilePicture = {
        url: undefined,
        public_id: undefined,
    };
    if (pic) {
        const result = await cloudinary.uploader.upload(pic, {
            folder: "chat-app/users",
            width: 150,
            crop: "scale",
        });
        // Throw an error if unable to upload the image
        if (!result || !result.public_id || !result.secure_url) {
            throw new InternalServerError("Unable to upload image");
        }

        profilePicture = {
            url: result.secure_url,
            public_id: result.public_id,
        };
    }

    // Create a new user
    const newUser = await User.create({
        name: name,
        username: username,
        email: email,
        password: password,
        profilePicture: profilePicture,
    });

    // Create a token for email verification
    const hash = crypto.randomBytes(32).toString("hex");

    // Sign the token with the secret key
    const signedToken = jwt.sign(
        { id: newUser._id, hash: hash },
        process.env.JWT_STRING,
        { expiresIn: "1h" }
    );

    // Save the token in the database
    await EmailVerificationToken.create({
        userId: newUser._id,
        hash: hash,
    });

    const emailSubject = "Email verification";
    const emailBody = `Please click on the link below to verify your email address: ${process.env.FRONTEND_BASE_URL}/emailVerification?token=${signedToken}`;
    await sendResetEmailMail(email, emailSubject, emailBody);

    // Send the response with Signup success message
    res.status(StatusCodes.CREATED).json({
        msg: "Signup Successful",
        status: true,
    });
};
