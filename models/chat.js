/**
 * @module chatSchema
 * @description Schema for the Chat model
 */

// Importing packages
const mongoose = require("mongoose");

// Define the schema for the chats
const ChatShema = new mongoose.Schema(
    {
        // The name of the chat
        chatName: {
            type: String,
            required: [true, "Please provide the chat name"],
            trim: true,
        },
        // The type of the chat
        isGroupChat: {
            type: Boolean,
            required: [true, "Please provide the chat type"],
            default: false,
        },
        // The ID of the users
        users: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
            ],
            validate: {
                // Validate if the length of the user array is less than 50
                validator: async function (val) {
                    return val.length <= 50;
                },
                message: "{PATH} exceeds the limit of 50",
            },
        },
        // The ID of the latest message
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
        // The ID of the admin
        groupAdmin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            // The groupAdmin field is required only if the chat is a group chat
            required: function () {
                return this.isGroupChat;
            },
        },
    },
    { timestamps: true }
);

// Create and export the Chat model
module.exports = mongoose.model("Chat", ChatShema);
