const db = require('../db/db');
//Add new categpry(for admin)
exports.createCategory = async (req, res) => {
    const { category_name, description } = req.body;
    try {
        const sql = "INSERT INTO categories (category_name, description) VALUES (?, ?)";
        await db.query(sql, [category_name, description]);
        res.status(201).json({ success: true, message: "Category successfully created!" });
    } catch (err) {
        res.status(500).json({ error: "Failed to create category: " + err.message });
    }
};
