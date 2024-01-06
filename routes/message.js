const express = require("express");
const { getAllMessages, sendMessage } = require("../controllers/message");
const {
    authenticationMiddleware,
    userExist,
    isVerified,
} = require("../middlewares");

const messageRouter = new express.Router();

messageRouter.get(
    "/get-all-messages/:chatId",
    authenticationMiddleware,
    userExist,
    isVerified,
    getAllMessages
);

messageRouter.post(
    "/send-message",
    authenticationMiddleware,
    userExist,
    isVerified,
    sendMessage
);

module.exports = messageRouter;
