const { StatusCodes } = require("http-status-codes");
const Chat = require("../../models/chat");

module.exports.getChats = async (req, res) => {
    const user = req.user;

    const chats = await Chat.find({
        users: { $elemMatch: { $eq: user._id } },
    })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate({
            path: "latestMessage",
            populate: {
                path: "sender",
                select: "name email profilePicture",
            },
        })
        .sort({ updatedAt: -1 });

    res.status(StatusCodes.OK).json({
        msg: "Chats found",
        status: true,
        result: chats,
    });
};
