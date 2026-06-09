const db = require('../db/db');

exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query("SELECT id, fullname, email, role, status FROM users WHERE role != 'admin'");
        res.status(200).json({ success: true, data: users });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching users" });
    }
};

// Status Block/Unblock 
exports.toggleUserStatus = async (req, res) => {
    const { id, status } = req.body;
    try {
        await db.query("UPDATE users SET status = ? WHERE id = ?", [status, id]);
        res.status(200).json({ success: true, message: "Status updated successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to update status" });
    }
};