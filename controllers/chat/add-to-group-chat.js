const { StatusCodes } = require("http-status-codes");
const Chat = require("../../models/chat");
const {
    NotFoundError,
    UnauthorizedError,
    InternalServerError,
    BadRequestError,
} = require("../../errors");

module.exports.addToGroupChat = async (req, res) => {
    const { chatId, userToBeAdded } = req.body;
    const user = req.user;

    if (!chatId || !userToBeAdded) {
        throw new NotFoundError(
            "Please provide group char member and group chat id"
        );
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
        throw new NotFoundError("No chat found");
    }

    if (chat.users.includes(userToBeAdded)) {
        throw new BadRequestError("User already exists in the group chat");
    }

    if (chat.users.length >= 50) {
        throw new BadRequestError("Group chat has reached maximum capacity");
    }

    if (chat.groupAdmin.toString() !== user._id.toString()) {
        throw new UnauthorizedError("Only Admin can add members to the chat");
    }

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        { $push: { users: userToBeAdded } },
        { new: true }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!updatedChat) {
        throw new InternalServerError(
            "Unable to add members to the group chat"
        );
    }

    res.status(StatusCodes.OK).json({
        msg: "Members added to group chat",
        status: true,
        result: updatedChat,
    });
};
