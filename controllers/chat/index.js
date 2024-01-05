const { accessChat } = require("./access-chat");
const { getChats } = require("./get-chats");
const { createGroupChat } = require("./create-group-chat");
const { addToGroupChat } = require("./add-to-group-chat");
const { removeFromGroupChat } = require("./remove-from-group-chat");
const { renameGroupChat } = require("./rename-group-chat");
const { leaveGroupChat } = require("./leave-group-chat");

module.exports = {
    accessChat,
    getChats,
    createGroupChat,
    renameGroupChat,
    removeFromGroupChat,
    addToGroupChat,
    leaveGroupChat,
};
