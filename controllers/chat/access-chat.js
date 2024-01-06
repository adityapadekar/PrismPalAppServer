const { StatusCodes } = require("http-status-codes");
const User = require("../../models/user");
const Chat = require("../../models/chat");
const { NotFoundError } = require("../../errors");

module.exports.accessChat = async (req, res) => {
    const { chatPartnerId } = req.body;
    const user = req.user;

    if (!chatPartnerId) {
        throw new NotFoundError("Please provide chat partner id");
    }

    const chatPartnerExists = await User.findById(chatPartnerId);

    if (!chatPartnerExists) {
        throw new NotFoundError("Chat partner not found");
    }

    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: user._id } } },
            { users: { $elemMatch: { $eq: chatPartnerId } } },
        ],
    })
        .populate("users", "-password")
        .populate({
            path: "latestMessage",
            populate: {
                path: "sender",
                select: "name email profilePicture",
            },
        });

    if (isChat.length > 0) {
        return res.status(StatusCodes.OK).json({
            msg: "Chat Found",
            status: true,
            result: isChat[0],
        });
    } else {
        const chatData = {
            chatName: "personalChat",
            isGroupChat: false,
            users: [user._id, chatPartnerId],
            latestMessage: null,
        };
        const createdChat = await Chat.create(chatData);
        const newChat = await Chat.findOne({ _id: createdChat._id })
            .populate("users", "-password")
            .populate({
                path: "latestMessage",
                populate: {
                    path: "sender",
                    select: "name email profilePicture",
                },
            });
        return res.status(StatusCodes.OK).json({
            msg: "Chat Found",
            status: true,
            result: newChat,
        });
    }
};
