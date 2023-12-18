/**
 * @module MessageSchema
 * @description Schema for the storing messages
 */

// Importing packages
const mongoose = require("mongoose");

// Define the MessageSchema
const MessageSchema = new mongoose.Schema(
    {
        // The message content
        content: {
            type: String,
            required: [true, "Please provide content"],
            trim: true,
        },
        // The ID of the chat
        chat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
            required: [true, "Please provide chat"],
        },
        // The ID of the sender
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Please provide sender"],
        },
    },
    { timestamps: true }
);

// Create and export the MessageSchema model
module.exports = mongoose.model("Message", MessageSchema);
