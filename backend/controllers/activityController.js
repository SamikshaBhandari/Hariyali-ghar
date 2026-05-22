const db = require('../db/db');

//Get login user order history
exports.getUserOrders = async (req, res) => {
    const user_id = req.user.id;

    try {
        const [orders] = await db.query(
            `SELECT id, total_amount, address, phone_number, payment_method, payment_status, status, created_at 
             FROM orders 
             WHERE user_id = ? 
             ORDER BY created_at DESC`,
            [user_id]
        );
        res.status(200).json({ success: true, data: orders });
    } catch (err) {
        console.error("Error in getUserOrders backend:", err);
        res.status(500).json({ success: false, message: "Failed to fetch user orders." });
    }
};

//Get login user product reviews
exports.getUserReviews = async (req, res) => {
    const user_id = req.user.id;

    try {
        const [reviews] = await db.query(
            `SELECT r.*, p.name AS product_name, p.image_url 
             FROM reviews r
             JOIN products p ON r.product_id = p.id 
             WHERE r.user_id = ? 
             ORDER BY r.created_at DESC`,
            [user_id]
        );
        res.status(200).json({ success: true, reviews });
    } catch (err) {
        console.error("Error in getUserReviews backend:", err);
        res.status(500).json({ success: false, message: "Failed to fetch user reviews." });
    }
};