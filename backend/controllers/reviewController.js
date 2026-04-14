const db = require('../db/db');

//Review Add garne logic
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