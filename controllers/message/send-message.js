const { StatusCodes } = require("http-status-codes");
const Chat = require("../../models/chat");
const Message = require("../../models/message");
const { NotFoundError } = require("../../errors");

module.exports.sendMessage = async (req, res) => {
    const { chatId, content } = req.body;
    const user = req.user;

    if (!chatId || !content) {
        throw new NotFoundError("Please provide chat id and message");
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
        throw new NotFoundError("No chat found");
    }

    const message = await Message.create({
        sender: user._id,
        content: content,
        chat: chatId,
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    const newMessage = await Message.findById(message._id)
        .populate("sender", "-password")
        .populate({
            path: "chat",
            populate: {
                path: "users",
                select: "-password",
            },
        });

    res.status(StatusCodes.OK).json({
        msg: "Message sent",
        status: true,
        result: newMessage,
    });
};
