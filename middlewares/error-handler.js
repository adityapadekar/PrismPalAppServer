const { StatusCodes } = require("http-status-codes");

// eslint-disable-next-line no-unused-vars
module.exports.errorHandlerMiddleware = async (err, req, res, next) => {
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || "Something went wrong, Please try again",
    };

    return res
        .status(customError.statusCode)
        .json({ msg: customError.msg, status: false });
};
