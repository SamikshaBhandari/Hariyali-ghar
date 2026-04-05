const db = require('../db/db');

//Read all product
exports.getAllProducts = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM products");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Server Error: " + err.message });
    }
};

//Product add logic
exports.addProduct = async (req, res) => {
    const { name, price, description, category, image_url, stock_quantity, sunlight, watering, care_tips } = req.body;

    try {
        //care guide sahit ko sql
        const sql = `INSERT INTO products 
            (name, price, description, category, image_url, stock_quantity, sunlight, watering, care_tips) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        await db.query(sql, [name, price, description, category, image_url, stock_quantity,
            sunlight, watering, care_tips]);
        res.status(201).json({ message: "Product successfully added with care instructions" });
    } catch (err) {
        res.status(500).json({ error: "Failed to add product: " + err.message });
    }
};
//product update
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, description, category, image_url, stock_quantity, sunlight, watering, care_tips } = req.body;
    try {
        const sql = `UPDATE products SET name=?, price=?,description=?,category=?,image_url=?,stock_quantity=?,sunlight=?,
        watering=?,care_tips=?WHERE id=?`;
        const [result] = await db.query(sql, [name, price, description, category, image_url, stock_quantity, sunlight, watering, care_tips, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'product not found' });
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
        res.status(200).json({ error: "Product deleted from list ." });
    }
    catch (err) {
        res.status(500).json({ error: "Deleted failed!:" + err.message });
    }
}