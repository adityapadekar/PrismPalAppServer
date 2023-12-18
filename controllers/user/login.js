// Importing packages
const { StatusCodes } = require("http-status-codes");

// Importing the User model
const User = require("../../models/user");

// Importing custom error classes
const {
    BadRequestError,
    NotFoundError,
    UnauthorizedError,
} = require("../../errors");

/**
 * Controller to handle the login request
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @throws {BadRequestError} - If required fields are missing
 * @throws {NotFoundError} - If no user is found with given credentials
 * @throws {UnauthorizedError} - If credentials are invalid
 */
module.exports.userLogin = async (req, res) => {
    const { loginCredential, password } = req.body;

    // Check if username, email, and password are provided
    if (!loginCredential || !password) {
        throw new BadRequestError(
            "Please provide username, email and password"
        );
    }

    // Find user with matching username or email
    const user = await User.findOne({
        $or: [{ username: loginCredential }, { email: loginCredential }],
    });

    // If no user is found, throw an error
    if (!user) {
        throw new NotFoundError("No User found with given credentials");
    }

    // Check if user is verified
    if (!user.isVerified) {
        throw new UnauthorizedError(
            "Kindly complete the email verification process by clicking on the link sent to your email."
        );
    }

    // Check if the password is correct
    const isPasswordCorrect = await user.checkPassword(password);

    // If the password is incorrect, throw an error
    if (!isPasswordCorrect) {
        throw new UnauthorizedError("Invalid credentials");
    }

    // Create a JWT token for the user
    const token = user.createJWT();

    // Send the response with login success message, user details, and token
    res.status(StatusCodes.OK).json({
        msg: "Login Successful",
        status: true,
        result: { user: user, token: token },
    });
};
