const db = require('../db/db');

//Add to Cart 
exports.addToCart = async (req, res) => {
    const { product_id, quantity } = req.body;
    const user_id = req.user.id;
    const requestedQty = parseInt(quantity) || 1;

    try {
        // At first check stock product
        const [product] = await db.query("SELECT name, stock_quantity FROM products WHERE id = ?", [product_id]);

        if (product.length === 0) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        if (product[0].stock_quantity < requestedQty) {
            return res.status(400).json({
                success: false,
                message: "Not enough stock available."
            });
        }

        //check if product is already in the user cart
        const [existing] = await db.query(
            "SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?",
            [user_id, product_id]
        );

        if (existing.length > 0) {
            const newTotalQty = existing[0].quantity + requestedQty;

            // Recheck stock for total quantity
            if (product[0].stock_quantity < newTotalQty) {
                return res.status(400).json({ success: false, message: "Total quantity exceeds available stock." });
            }

            await db.query("UPDATE cart SET quantity = ? WHERE id = ?", [newTotalQty, existing[0].id]);
            return res.status(200).json({ success: true, message: "Cart updated ." });
        }

        //insert new product
        await db.query(
            "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
            [user_id, product_id, requestedQty]
        );

        res.status(201).json({ success: true, message: "Product added to cart successfully." });

    } catch (err) {
        res.status(500).json({ success: false, error: "Cart error: " + err.message });
    }
};

//View Cart 
exports.getCart = async (req, res) => {
    const user_id = req.user.id;
    try {
        const sql = `
            SELECT cart.id, products.name, products.price, products.image_url, cart.quantity, (products.price * cart.quantity) AS subtotal 
            FROM cart 
            JOIN products ON cart.product_id = products.id 
            WHERE cart.user_id = ?`;

        const [items] = await db.query(sql, [user_id]);

        //Grand Total nikalne logic 
        const grandTotal = items.reduce((total, item) => total + parseFloat(item.subtotal), 0);
        res.status(200).json({
            success: true,
            totalItems: items.length,
            grandTotal: grandTotal.toFixed(2),
            data: items
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 3. Update Cart Quantity 
exports.updateCartQuantity = async (req, res) => {
    const { id, quantity } = req.body;
    const user_id = req.user.id;
    if (quantity < 1) return res.status(400).json({ success: false, message: "Quantity must be at least 1." });

    try {
        //First Stock check 
        const [check] = await db.query(
            "SELECT p.stock_quantity FROM cart c JOIN products p ON c.product_id = p.id WHERE c.id = ? AND c.user_id = ?",
            [id, user_id]
        );

        if (check.length === 0) return res.status(404).json({ success: false, message: "Cart item not found." });

        if (check[0].stock_quantity < quantity) {
            return res.status(400).json({ success: false, message: "Stock limit reached." });
        }

        await db.query("UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?", [quantity, id, user_id]);
        res.status(200).json({ success: true, message: "Quantity updated successfully." });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 4. Delete item from cart
exports.removeFromCart = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;

    try {
        const [result] = await db.query("DELETE FROM cart WHERE id = ? AND user_id = ?", [id, user_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Item not found in your cart." });
        }
        res.status(200).json({ success: true, message: "Item removed from cart." });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};