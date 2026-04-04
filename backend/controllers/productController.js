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