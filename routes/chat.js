const express = require("express");
const {
    accessChat,
    getChats,
    createGroupChat,
    renameGroupChat,
    removeFromGroupChat,
    addToGroupChat,
    leaveGroupChat,
} = require("../controllers/chat");
const {
    authenticationMiddleware,
    userExist,
    isVerified,
} = require("../middlewares");

const chatRouter = new express.Router();

chatRouter.post(
    "/access-chat",
    authenticationMiddleware,
    userExist,
    isVerified,
    accessChat
);
chatRouter.get(
    "/get-chat",
    authenticationMiddleware,
    userExist,
    isVerified,
    getChats
);
chatRouter.post(
    "/create-group-chat",
    authenticationMiddleware,
    userExist,
    isVerified,
    createGroupChat
);
chatRouter.patch(
    "/rename-group-chat",
    authenticationMiddleware,
    userExist,
    isVerified,
    renameGroupChat
);
chatRouter.patch(
    "/remove-from-group-chat",
    authenticationMiddleware,
    userExist,
    isVerified,
    removeFromGroupChat
);
chatRouter.patch(
    "/add-to-group-chat",
    authenticationMiddleware,
    userExist,
    isVerified,
    addToGroupChat
);
chatRouter.patch(
    "/leave-group-chat",
    authenticationMiddleware,
    userExist,
    isVerified,
    leaveGroupChat
);

module.exports = chatRouter;
