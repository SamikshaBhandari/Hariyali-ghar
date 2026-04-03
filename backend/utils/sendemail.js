const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        // Service bhanda host ra port use garnu dherai stable huney 
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        // From ma name ra email dubai rakhne banako
        from: '"Hariyali-Ghar" <hariyalighar78@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    };
    // try catch thapne jasle garda error aayo bhane terminal ma thaha hunchha
    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully!");
    } catch (error) {
        console.error("Email Error: ", error);
        throw error;
    }
};

module.exports = sendEmail;