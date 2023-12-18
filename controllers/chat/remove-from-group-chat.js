// Importing packages
const { StatusCodes } = require("http-status-codes");

// Importing the User model
const Chat = require("../../models/chat");

// Importing custom error classes
const {
    NotFoundError,
    UnauthorizedError,
    InternalServerError,
} = require("../../errors");

module.exports.removeFromGroupChat = async (req, res) => {
    const { chatId, usersToBeRemoved } = req.body;
    const user = req.user;

    if (!chatId || !usersToBeRemoved) {
        throw new NotFoundError(
            "Please provide group char members and group chat id"
        );
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
        throw new NotFoundError("No chat found");
    }

    if (chat.groupAdmin.toString() !== user._id.toString()) {
        throw new UnauthorizedError(
            "Only Admin can remove members from the chat"
        );
    }

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        { $pull: { users: usersToBeRemoved } },
        { new: true }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!updatedChat) {
        throw new InternalServerError(
            "Unable to remove members from the group chat"
        );
    }

    res.status(StatusCodes.OK).json({
        msg: "Members removed from the group chat",
        status: true,
        result: updatedChat,
    });
};
