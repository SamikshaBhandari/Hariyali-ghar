const db = require('../db/db');
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');
require('dotenv').config();

exports.signup = async (req, res) => {
    const { fullname, address, mobile, email, password } = req.body;
    try {
        const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: "Email Register already" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const sql = "INSERT INTO users (fullname, address, mobile, email, password) VALUES (?, ?, ?, ?, ?)";
        await db.query(sql, [fullname, address, mobile, email, hashedPassword]);
        
        res.status(201).json({ message: "User successfully register" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

        if (users.length === 0) {
            return res.status(400).json({ error: "Email not found! Signup first." });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: " Wrong Password" });
        }
        const secretKey = process.env.JWT_SECRET;
        if (!secretKey) {
        console.error("JWT_SECRET is missing in .env file!");
        return res.status(500).json({ error: "Internal Server Error: Security Key missing" });
        }
            const token = jwt.sign(
            { id: user.id, role: user.role },
            secretKey, 
            { expiresIn: '1d' }
            );

        res.status(200).json({
            message: "Login Successful!",
            token: token,
            user: {
                id: user.id,
                fullname: user.fullname,
                email: user.email,
                role: user.role 
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
};