const db = require('../db/db');

//Add review section
exports.addReview = async (req, res) => {
    const user_id = req.user.id;
    const { product_id, rating, comment } = req.body;

    try {
        const [existing] = await db.query(
            "SELECT * FROM reviews WHERE user_id = ? AND product_id = ?",
            [user_id, product_id]
        );
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: "You have already reviewed this product." });
        }
        //Save to Database
        await db.query(
            "INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)",
            [user_id, product_id, rating, comment]
        );

        res.status(201).json({ success: true, message: "Review added successfully!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

//get review section
exports.getProductReviews = async (req, res) => {
    const { product_id } = req.params;
    try {
        const [reviews] = await db.query(
            `SELECT reviews.*, users.fullname 
             FROM reviews 
             JOIN users ON reviews.user_id = users.id 
             WHERE product_id = ? 
             ORDER BY created_at DESC`, [product_id]
        );
        res.status(200).json({ success: true, reviews });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};