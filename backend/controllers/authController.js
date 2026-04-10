const db = require('../db/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const sendEmail = require('../utils/sendEmail');

//Signup Logic
exports.signup = async (req, res) => {
    const { fullname, address, mobile, email, password } = req.body;
    try {
        const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: "Email already registered" });
        }

        //OTP generate
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        //OTP expiry time setup
        const otpExpiresAt = new Date(Date.now() + 5 * 60000);
        const hashedPassword = await bcrypt.hash(password, 10);

        //save to Database 
        const sql = "INSERT INTO users (fullname, address, mobile, email, password, otp, otp_expires_at) VALUES (?, ?, ?, ?, ?, ?, ?)";
        await db.query(sql, [fullname, address, mobile, email, hashedPassword, otp, otpExpiresAt]);

        //send email
        const message = `Namaste ${fullname},\n\nWelcome to Hariyali-Ghar! Your verification code is: ${otp}.\nThis code will expire in 5 minutes. Please do not share it with anyone.`;

        await sendEmail({
            email: email,
            subject: 'Hariyali-Ghar: Account Verification Code',
            message: message
        });
        res.status(201).json({ message: "OTP sent to your email. Please verify." });
    } catch (err) {
        //if email fail,rollback to user 
        await db.query("DELETE FROM users WHERE email = ? AND is_verified = 0", [email]);
        console.error(err);
        res.status(500).json({ error: "Failed to send email. Please try again." });
    }
};

//OTP Verify Logic 
exports.verifyEmail = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) {
            return res.status(400).json({ error: "User not found" });
        }
        const user = users[0];
        //OTP Check
        if (user.otp !== otp) {
            return res.status(400).json({ error: "Invalid OTP code" });
        }

        //Expiry Check
        const currentTime = new Date();
        if (new Date(user.otp_expires_at) < currentTime) {
            return res.status(400).json({ error: "OTP has expired. Please signup again." });
        }

        //Database Update
        await db.query(
            "UPDATE users SET is_verified = 1, otp = NULL, otp_expires_at = NULL WHERE email = ?",
            [email]
        );
        res.status(200).json({
            success: true,
            message: "Email verified successfully! You can now login."
        });
    } catch (err) {
        console.error("Verify Error:", err);
        res.status(500).json({ error: "Verification failed" });
    }
};

//Login Logic
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) {
            return res.status(400).json({ error: "Email not found!" });
        }
        const user = users[0];
        if (user.is_verified === 0) {
            return res.status(401).json({ error: "Account not verified. Please check your email for OTP." });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid password" });
        }
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '365d' }
        );

        try {
            await sendEmail({
                email: user.email,
                subject: 'Security Alert: New Login to your Hariyali-Ghar Account',
                message: `Namaste ${user.fullname},\n\nYou just logged in to Hariyali-Ghar successfully.\n\nDate: ${new Date().toLocaleString()}\n\nIf this was not you, please secure your account immediately.\n\nHappy Planting,\nHariyali-Ghar`
            });
        } catch (emailErr) {
            console.error("Login notification email failed:", emailErr);
        }

        res.status(200).json({
            message: "Login Successful!",
            token: token,
            user: { id: user.id, fullname: user.fullname, email: user.email, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
};