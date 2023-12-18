// Importing packages
const { StatusCodes } = require("http-status-codes");

// Importing the User model
const Chat = require("../../models/chat");
const Message = require("../../models/message");

// Importing custom error classes
const { NotFoundError } = require("../../errors");

module.exports.getAllMessages = async (req, res) => {
    const { chatId } = req.params;

    if (!chatId) {
        throw new NotFoundError("Please provide chat id");
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
        throw new NotFoundError("No chat found");
    }

    const messages = await Message.find({ chat: chatId })
        .populate("sender", "-password")
        .populate("chat");

    if (!messages) {
        throw new NotFoundError("Unable to fetch messages");
    }

    res.status(StatusCodes.OK).json({
        msg: "Messages fetched",
        status: true,
        result: messages,
    });
};
