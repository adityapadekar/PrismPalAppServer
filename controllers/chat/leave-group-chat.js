const { StatusCodes } = require("http-status-codes");
const Chat = require("../../models/chat");
const { NotFoundError, InternalServerError } = require("../../errors");

module.exports.leaveGroupChat = async (req, res) => {
    const { chatId } = req.body;
    const user = req.user;

    if (!chatId) {
        throw new NotFoundError("Please provide group chat id");
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
        throw new NotFoundError("No chat found");
    }

    if (chat.groupAdmin.toString() === user._id.toString()) {
        const result = await Chat.findByIdAndDelete(chatId);

        if (!result) {
            throw new InternalServerError("Unable to leave group chat");
        }

        return res.status(StatusCodes.OK).json({
            msg: "Group chat left",
            status: true,
        });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        { $pull: { users: user._id } },
        { new: true }
    );

    if (!updatedChat) {
        throw new InternalServerError(
            "Unable to remove members from the group chat"
        );
    }

    res.status(StatusCodes.OK).json({
        msg: "Group chat left",
        status: true,
    });
};
