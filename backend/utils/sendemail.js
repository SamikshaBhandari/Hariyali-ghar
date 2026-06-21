const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: '"Hariyali-Ghar" <hariyalighar78@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully!");
    } catch (error) {
        console.error("Email Error: ", error);
        throw error;
    }
};

module.exports = sendEmail;