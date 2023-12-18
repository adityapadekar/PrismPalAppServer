// Importing packages
const { StatusCodes } = require("http-status-codes");

// Importing the User model
const Chat = require("../../models/chat");

// Importing custom error classes
const { NotFoundError, InternalServerError } = require("../../errors");

module.exports.createGroupChat = async (req, res) => {
    const { groupCharMembers, groupChatName } = req.body;
    const user = req.user;

    if (!groupCharMembers.length || !groupChatName) {
        throw new NotFoundError(
            "Please provide group char members and group chat name"
        );
    }

    const chatData = {
        chatName: groupChatName,
        isGroupChat: true,
        users: [user._id, ...groupCharMembers],
        groupAdmin: user._id,
        latestMessage: null,
    };

    const newChat = await Chat.create(chatData);

    if (!newChat) {
        throw new InternalServerError("Unable to create group chat");
    }

    const chat = await Chat.findById(newChat._id)
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!chat) {
        throw new NotFoundError("No chat found");
    }

    res.status(StatusCodes.OK).json({
        msg: "Group chat created",
        status: true,
        result: chat,
    });
};
