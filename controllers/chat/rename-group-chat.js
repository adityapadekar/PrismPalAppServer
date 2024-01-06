const { StatusCodes } = require("http-status-codes");
const Chat = require("../../models/chat");
const {
    NotFoundError,
    UnauthorizedError,
    InternalServerError,
} = require("../../errors");

module.exports.renameGroupChat = async (req, res) => {
    const { chatId, chatName } = req.body;
    const user = req.user;

    if (!chatId || !chatName) {
        throw new NotFoundError(
            "Please provide group char members and group chat name"
        );
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
        throw new NotFoundError("No chat found");
    }

    if (chat.groupAdmin.toString() !== user._id.toString()) {
        throw new UnauthorizedError("Only Admin can rename the chat");
    }

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        { chatName },
        { new: true }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!updatedChat) {
        throw new InternalServerError("Unable to rename group chat");
    }

    res.status(StatusCodes.OK).json({
        msg: "Chats Renamed",
        status: true,
        result: updatedChat,
    });
};
