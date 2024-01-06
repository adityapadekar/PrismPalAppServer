const nodemailer = require("nodemailer");
const { InternalServerError } = require("../errors");

module.exports.sendResetEmailMail = async (email, subject, body) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.RESET_PASSWORD_EMAIL,
                pass: process.env.RESET_PASSWORD_EMAIL_TEMP_PASSWORD,
            },
        });

        const details = {
            from: process.env.RESET_PASSWORD_EMAIL,
            to: email,
            subject: subject,
            text: body,
        };

        await transporter.sendMail(details);
    } catch (error) {
        throw new InternalServerError("Unable to send password reset email");
    }
};
