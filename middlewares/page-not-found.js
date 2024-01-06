const { StatusCodes } = require("http-status-codes");

module.exports.pageNotFound = async (req, res) => {
    res.status(StatusCodes.NOT_FOUND).json({
        msg: "Route does not exist",
        status: false,
    });
};
