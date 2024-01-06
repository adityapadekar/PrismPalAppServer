const express = require("express");
const {
    signUp,
    userLogin,
    userEmailVerification,
    searchUser,
    forgotPassword,
    resetPassword,
    changePassword,
} = require("../controllers/user");
const {
    authenticationMiddleware,
    userExist,
    isVerified,
} = require("../middlewares");

const userRouter = new express.Router();

userRouter.post("/signup", signUp);

userRouter.post("/login", userLogin);

userRouter.get("/email-verification/:token", userEmailVerification);

userRouter.get(
    "/searchuser",
    authenticationMiddleware,
    userExist,
    isVerified,
    searchUser
);

userRouter.post("/forgot-password", forgotPassword);

userRouter.post("/reset-password/:token", resetPassword);

userRouter.post(
    "/change-password",
    authenticationMiddleware,
    userExist,
    isVerified,
    changePassword
);

module.exports = userRouter;
