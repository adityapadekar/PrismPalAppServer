const { StatusCodes } = require("http-status-codes");
const User = require("../../models/user");
const {
    BadRequestError,
    NotFoundError,
    UnauthorizedError,
} = require("../../errors");

module.exports.userLogin = async (req, res) => {
    const { loginCredential, password } = req.body;

    if (!loginCredential || !password) {
        throw new BadRequestError(
            "Please provide username, email and password"
        );
    }

    const user = await User.findOne({
        $or: [{ username: loginCredential }, { email: loginCredential }],
    });

    if (!user) {
        throw new NotFoundError("No User found with given credentials");
    }

    if (!user.isVerified) {
        throw new UnauthorizedError(
            "Kindly complete the email verification process by clicking on the link sent to your email."
        );
    }

    const isPasswordCorrect = await user.checkPassword(password);

    if (!isPasswordCorrect) {
        throw new UnauthorizedError("Invalid credentials");
    }

    const token = user.createJWT();

    res.status(StatusCodes.OK).json({
        msg: "Login Successful",
        status: true,
        result: { user: user, token: token },
    });
};
