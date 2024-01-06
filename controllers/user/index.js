const { signUp } = require("./signup");
const { userLogin } = require("./login");
const { userEmailVerification } = require("./email-verification");
const { searchUser } = require("./search-user");
const { forgotPassword } = require("./forgot-password");
const { resetPassword } = require("./reset-password");
const { changePassword } = require("./change-password");

module.exports = {
    signUp,
    userLogin,
    userEmailVerification,
    searchUser,
    forgotPassword,
    resetPassword,
    changePassword,
};
