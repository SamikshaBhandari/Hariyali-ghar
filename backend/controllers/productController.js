// setup 
const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/all',async(req,res)=>{
    try{
        const [rows]=await db.query("SELECT * FROM products");
        res.json(rows);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

router.post('/add', async (req, res) => {
    const { name, price, description, category, image_url, stock_quantity } = req.body;
    try {
        const sql = "INSERT INTO products (name, price, description, category, image_url, stock_quantity) VALUES (?, ?, ?, ?, ?, ?)";
        await db.query(sql, [name, price, description, category, image_url, stock_quantity]);
        res.status(201).json({ message: "Product successfully added" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;