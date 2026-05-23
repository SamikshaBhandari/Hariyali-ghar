const db = require('../db/db');

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