const db = require('../db/db');

// Read all product with Category Name and Average Rating
exports.getAllProducts = async (req, res) => {
    try {
        const sql = `
            SELECT 
                products.*, 
                categories.category_name,
                IFNULL(AVG(reviews.rating), 0) as average_rating
            FROM products 
            LEFT JOIN categories ON products.category_id = categories.id
            LEFT JOIN reviews ON products.id = reviews.product_id
            GROUP BY products.id`;

        const [rows] = await db.query(sql);
        res.status(200).json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ error: "Server Error: " + err.message });
    }
};
//Product add logic
exports.addProduct = async (req, res) => {
    const { name, price, description, category_id, image_url, stock_quantity, sunlight, watering, care_tips } = req.body;

    try {
        //care guide sahit ko sql
        const sql = `INSERT INTO products 
            (name, price, description, category_id, image_url, stock_quantity, sunlight, watering, care_tips) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        await db.query(sql, [name, price, description, category_id, image_url, stock_quantity,
            sunlight, watering, care_tips]);
        res.status(201).json({ message: "Product successfully added with care instructions." });
    } catch (err) {
        res.status(500).json({ error: "Failed to add product: " + err.message });
    }
};
//product update
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, description, category_id, image_url, stock_quantity, sunlight, watering, care_tips } = req.body;
    try {
        const sql = `UPDATE products SET name=?, price=?,description=?,category_id=?,image_url=?,stock_quantity=?,sunlight=?,
        watering=?,care_tips=?WHERE id=?`;
        const [result] = await db.query(sql, [name, price, description, category_id, image_url, stock_quantity, sunlight, watering, care_tips, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'product not found.' });
        }
        res.status(200).json({ message: 'Product successfully updated.' });
    }
    catch (err) {
        res.status(500).json({ error: 'Update failed:' + err.message });
    }
}

//product delete 
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query("DELETE FROM products WHERE id=?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "product already removed." });

        }
        res.status(200).json({ message: "Product deleted from list." });
    }
    catch (err) {
        res.status(500).json({ error: "Deleted failed!:" + err.message });
    }
}