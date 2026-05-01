const db = require('../db/db');
//Add new category(for admin)
exports.createCategory = async (req, res) => {
    const { category_name, category_image, description } = req.body;
    try {
        const sql = "INSERT INTO categories (category_name,category_image, description) VALUES (?,?,?)";
        await db.query(sql, [category_name, category_image, description]);
        res.status(201).json({ success: true, message: "Category successfully created!" });
    } catch (err) {
        res.status(500).json({ error: "Failed to create category: " + err.message });
    }
};
//get all category for both amin and user
exports.getCategories = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM categories");
        res.status(200).json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
//update category for admin
exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { category_name, category_image, description } = req.body;

    try {
        const sql = "UPDATE categories SET category_name = ?,category_image=?, description = ? WHERE id = ?";
        await db.query(sql, [category_name, category_image, description, id]);
        res.status(200).json({ success: true, message: "Category updated successfully" });
    } catch (err) {
        res.status(500).json({ error: "Update failed: " + err.message });
    }
};