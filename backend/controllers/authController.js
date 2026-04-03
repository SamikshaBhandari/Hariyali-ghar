const db = require('../db/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const sendEmail = require('../utils/sendEmail');

//signup logic
exports.signup = async (req, res) => {
    const { fullname, address, mobile, email, password } = req.body;
    try {
        // Email register chha ki nai check garne logic
        const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: "Email Register already" });
        }

        // OTP generate garne logic
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedPassword = await bcrypt.hash(password, 10);

        // Database ma save garne
        const sql = "INSERT INTO users (fullname, address, mobile, email, password, otp) VALUES (?, ?, ?, ?, ?, ?)";
        await db.query(sql, [fullname, address, mobile, email, hashedPassword, otp]);

        // Real Email pathaune
        const message = `Namaste ${fullname},\n\n Welcome to Hariyali ghar! Verify your account to use otp code: ${otp}`;

        await sendEmail({
            email: email,
            subject: 'Hariyali-Ghar: Email Verification Code',
            message: message
        });

        res.status(201).json({ message: "User registered. Please check your email for OTP." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
};

//otp verify
exports.verifyEmail = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const [user] = await db.query("SELECT * FROM users WHERE email = ? AND otp = ?", [email, otp]);

        if (user.length === 0) {
            return res.status(400).json({ error: "Invalid OTP or Email" });
        }

        // OTP match bhayo bhane verified garne ra OTP delete garne
        await db.query("UPDATE users SET is_verified = 1, otp = NULL WHERE email = ?", [email]);
        res.status(200).json({ message: "Email verified successfully! You can now login." });
    } catch (err) {
        res.status(500).json({ error: "Verification failed" });
    }
};

//login logic
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

        if (users.length === 0) {
            return res.status(400).json({ error: "Email not found!" });
        }

        const user = users[0];

        //yadi user verified xaina vaney login huna nadiney 
        if (user.is_verified === 0) {
            return res.status(401).json({ error: "Please verify your email first!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Wrong Password" });
        }
        const secretKey = process.env.JWT_SECRET;
        const token = jwt.sign(
            { id: user.id, role: user.role },
            secretKey,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: "Login Successful!",
            token: token,
            user: { id: user.id, fullname: user.fullname, email: user.email, role: user.role }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
};