const { StatusCodes } = require("http-status-codes");
const User = require("../../models/user");
const { NotFoundError } = require("../../errors");

module.exports.searchUser = async (req, res) => {
    const user = req.user;
    /* eslint-disable */
    const searchQuery = req.query.search
        ? {
              $and: [
                  {
                      $or: [
                          { name: { $regex: req.query.search, $options: "i" } },
                          {
                              email: {
                                  $regex: req.query.search,
                                  $options: "i",
                              },
                          },
                      ],
                  },
                  { _id: { $ne: user._id } },
              ],
          }
        : { _id: { $ne: user._id } };
    /* eslint-enable */

    const users = await User.find(searchQuery).select("-password -isVerified");

    if (!users || users.length === 0) {
        throw new NotFoundError("No users found");
    }

    res.status(StatusCodes.OK).json({
        msg: "Users Found",
        status: true,
        result: users,
    });
};
