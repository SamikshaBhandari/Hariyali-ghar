const db = require('../db/db');

//Get log in user details
exports.getProfile = async (req, res) => {
    const user_id = req.user.id;

    try {
        const [user] = await db.query(
            "SELECT id, fullname, email, role, created_at FROM users WHERE id = ?",
            [user_id]
        );

        if (user.length === 0) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        res.status(200).json({ success: true, data: user[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error: Could not fetch profile." });
    }
};

// Update user details
exports.updateProfile = async (req, res) => {
    const user_id = req.user.id;
    const { fullname, email } = req.body;

    if (!fullname || !email) {
        return res.status(400).json({ success: false, message: "Full Name and Email are required." });
    }

    try {
        await db.query(
            "UPDATE users SET fullname = ?, email = ? WHERE id = ?",
            [fullname, email, user_id]
        );

        res.status(200).json({ success: true, message: "Profile updated successfully! " });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error: Could not update profile." });
    }
};