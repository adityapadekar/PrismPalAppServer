/**
 * @module userRouter
 * @description Router for handling user routes
 */

// Importing packages
const express = require("express");

// Importing Controllers
const {
    userSignUp,
    userLogin,
    userEmailVerification,
    searchUser,
} = require("../controllers/user");

// Importing middlewares
const {
    authenticationMiddleware,
    userExist,
    isVerified,
} = require("../middlewares");

// Creating a new router instance
const userRouter = new express.Router();

userRouter.post("/signup", userSignUp);

userRouter.post("/login", userLogin);

userRouter.get("/email-verification/:id/:token", userEmailVerification);

userRouter.get(
    "/searchuser",
    authenticationMiddleware,
    userExist,
    isVerified,
    searchUser
);

// Exporting the userRouter module
module.exports = userRouter;
