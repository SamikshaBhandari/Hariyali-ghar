const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'EMAIL_USER',
            pass: 'EMAIL_PASS'
        }
    });

    const mailOptions = {
        from: 'Hariyali-Ghar <noreply@hariyalighar.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;