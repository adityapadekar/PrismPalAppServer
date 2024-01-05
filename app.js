/*******************************************************************************
 * Server Setup
 ******************************************************************************/
// Load environment variables from a .env file
require("dotenv").config();

// Importing packages
require("express-async-errors");
const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");
const morgan = require("morgan");

// Create an instance of the Express application
const app = express();

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Enable logging
app.use(morgan("dev"));

// Parse JSON bodies
app.use(express.json({ limit: "50mb" }));

// Importing middlewares
const { errorHandlerMiddleware, pageNotFound } = require("./middlewares");

// Importing module for database connection
const { connectDB } = require("./db/connect");

/*******************************************************************************
 * Testing Get Route
 ******************************************************************************/

app.get("/", (req, res) => {
    res.send("Chat App!");
});

/*******************************************************************************
 * HandleRouting
 ******************************************************************************/
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
const messageRouter = require("./routes/message");

app.use("/api/v1/user", userRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/message", messageRouter);

/*******************************************************************************
 * Manage Unexpected Errors
 ******************************************************************************/
// Use the page not found middleware
app.use(pageNotFound);

// Use the error handler middleware
app.use(errorHandlerMiddleware);

// Define the port number for the server
const port = process.env.PORT || 8080;

// Define the MongoDB connection URI
const mongoDBConnectionUri = process.env.MONGO_DB_URI;

/*******************************************************************************
 * Start Server
 ******************************************************************************/
const server = http.createServer(app);
const startServer = async () => {
    try {
        // Connect to the MongoDB database
        await connectDB(mongoDBConnectionUri);

        // Start the server and listen on the specified port
        server.listen(
            port,
            () => console.log(`Server is listening on port : ${port}`) // eslint-disable-line
        );
    } catch (error) {
        console.log(error); // eslint-disable-line
        process.exit(1);
    }
};

// Call the startServer function to start the server
startServer();

/*******************************************************************************
 * Socket.io
 ******************************************************************************/
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        // origin: "http://localhost:3000",
        methods: ["GET", "POST", "PATCH", "DELETE"],
    },
});

io.on("connection", (socket) => {
    console.log("connected to socket io"); // eslint-disable-line

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room); // eslint-disable-line
    });

    socket.on("new message", (newMessageReceived) => {
        let chat = newMessageReceived.chat;

        if (!chat.users) return console.log("chat.users not defined"); // eslint-disable-line

        chat.users.forEach((user) => {
            if (user._id === newMessageReceived.sender._id) return;
            socket.to(user._id).emit("message received", newMessageReceived);
        });
    });

    socket.on("typing", (room) => {
        socket.broadcast.to(room).emit("typing");
    });

    socket.on("stop typing", (room) => {
        socket.broadcast.to(room).emit("stop typing");
    });

    socket.off("setup", (userData) => {
        console.log("USER DISCONNECTED"); // eslint-disable-line
        socket.leave(userData._id);
    });
});
