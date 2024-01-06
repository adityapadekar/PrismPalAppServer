const User = require("../models/user");
const { NotFoundError } = require("../errors");

module.exports.userExist = async (req, res, next) => {
    const { userId } = req.credentials;

    const user = await User.findById(userId).select("-password");

    if (!user) {
        throw new NotFoundError("No account with this email");
    }
    
    req.user = user;
    next();
};
