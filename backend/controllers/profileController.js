const db = require('../db/db');
const bcrypt = require('bcryptjs');

// Get Login User Details
exports.getProfile = async (req, res) => {
    const user_id = req.user.id;

    try {
        const [user] = await db.query(
            "SELECT id, fullname, email, mobile, address, role, created_at FROM users WHERE id = ?",
            [user_id]
        );

        if (user.length === 0) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        res.status(200).json({ success: true, data: user[0] });
    } catch (err) {
        console.error("Error in getProfile backend:", err);
        res.status(500).json({ success: false, message: "Server Error: Could not fetch profile." });
    }
};

// Update User Details
exports.updateProfile = async (req, res) => {
    const user_id = req.user.id;

    // Capture fields smoothly
    const { fullname, mobile, phone, address } = req.body;
    const finalPhone = mobile || phone || null;

    if (!fullname) {
        return res.status(400).json({ success: false, message: "Full Name field validation failed. Cannot be empty." });
    }

    try {
        if (finalPhone) {
            const [existingMobile] = await db.query(
                "SELECT id FROM users WHERE (mobile = ? OR phone = ?) AND id != ?",
                [finalPhone, finalPhone, user_id]
            );

            if (existingMobile.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: "This phone number is already taken by another account."
                });
            }
        }

        await db.query(
            "UPDATE users SET fullname = ?, mobile = ?, address = ? WHERE id = ?",
            [fullname, finalPhone, address, user_id]
        );

        return res.status(200).json({ success: true, message: "Changes saved successfully!" });

    } catch (err) {
        console.error("Primary query failed, running fallback scheme...", err.message);

        try {
            await db.query(
                "UPDATE users SET fullname = ?, phone = ?, address = ? WHERE id = ?",
                [fullname, finalPhone, address, user_id]
            );
            return res.status(200).json({ success: true, message: "Changes saved successfully!" });
        } catch (fallbackErr) {
            console.error("Fallback query completely failed:", fallbackErr.message);
            return res.status(500).json({
                success: false,
                message: "Database structural mismatch"
            });
        }
    }
};

// Delete Logged in User Account
exports.deleteAccount = async (req, res) => {
    const user_id = req.user.id;

    try {
        const [userRows] = await db.query("SELECT id, fullname, email, role FROM users WHERE id = ?", [user_id]);

        if (userRows.length === 0) {
            return res.status(404).json({ success: false, message: "User account not found." });
        }

        if (userRows[0].role === 'admin') {
            return res.status(403).json({
                success: false,
                message: "Admin accounts cannot be deleted for security reasons."
            });
        }

        const anonymizedEmail = `deleted_${user_id}_${Date.now()}@deleted.local`;
        const unusablePasswordHash = await bcrypt.hash(`deleted_${user_id}_${Date.now()}`, 10);

        await db.query(
            "UPDATE users SET fullname = ?, email = ?, password = ?, mobile = NULL, address = NULL, otp = NULL, otp_expires_at = NULL, reset_otp = NULL, reset_otp_expires_at = NULL, is_verified = 0 WHERE id = ?",
            ["Deleted User", anonymizedEmail, unusablePasswordHash, user_id]
        );

        await db.query("DELETE FROM cart WHERE user_id = ?", [user_id]);
        await db.query("DELETE FROM reviews WHERE user_id = ?", [user_id]);

        return res.status(200).json({
            success: true,
            message: "Your account has been deleted successfully."
        });
    } catch (err) {
        console.error("Delete Account Error:", err);
        return res.status(500).json({
            success: false,
            message: "Could not delete your account due to a server error."
        });
    }
};