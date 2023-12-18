/**
 * @module messageRouter
 * @description Router for handling message routes
 */

// Importing packages
const express = require("express");

// Importing Controllers
const { getAllMessages, sendMessage } = require("../controllers/message");

// Importing middlewares
const {
    authenticationMiddleware,
    userExist,
    isVerified,
} = require("../middlewares");

// Creating a new router instance
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

// Exporting the messageRouter module
module.exports = messageRouter;
