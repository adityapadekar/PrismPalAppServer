/**
 * @module sendResetEmailMail
 * @description Send email utility function
 */

// Importing packages
const nodemailer = require("nodemailer");

// Importing errors
const { InternalServerError } = require("../errors");

/**
 * Sends a password reset email using Gmail SMTP service.
 * @param {string} email - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} body - The body of the email.
 * @throws {InternalServerError} - If there is an error sending the email.
 */
module.exports.sendResetEmailMail = async (email, subject, body) => {
    try {
        // Create a transporter using Gmail SMTP
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

        // Define the email details
        const details = {
            from: process.env.RESET_PASSWORD_EMAIL,
            to: email,
            subject: subject,
            text: body,
        };

        // Send the email
        await transporter.sendMail(details);
    } catch (error) {
        // Throw an error if there is an error sending the email
        throw new InternalServerError("Unable to send password reset email");
    }
};
