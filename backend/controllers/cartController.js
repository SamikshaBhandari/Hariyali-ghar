const db = require('../db/db');

//Add to Cart 
exports.addToCart = async (req, res) => {
    const { product_id, quantity } = req.body;
    const user_id = req.user.id;
    const requestedQty = parseInt(quantity) || 1;

    try {
        //At first check stock product
        const [product] = await db.query("SELECT name, stock_quantity FROM products WHERE id = ?", [product_id]);

        if (product.length === 0) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        if (product[0].stock_quantity < requestedQty) {
            return res.status(400).json({
                success: false,
                message: `Only ${product[0].stock_quantity} items left in stock.`
            });
        }

        //Check if product is already in the user cart
        const [existing] = await db.query(
            "SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?",
            [user_id, product_id]
        );

        if (existing.length > 0) {
            const newTotalQty = existing[0].quantity + requestedQty;

            //Recheck stock for total quantity
            if (product[0].stock_quantity < newTotalQty) {
                return res.status(400).json({
                    success: false,
                    message: `Cannot add more. Only ${product[0].stock_quantity} available in total.`
                });
            }

            await db.query("UPDATE cart SET quantity = ? WHERE id = ?", [newTotalQty, existing[0].id]);
            return res.status(200).json({ success: true, message: "Cart updated." });
        }

        //Insert new product
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
            SELECT cart.id, products.name, products.price, products.image_url, 
                   products.stock_quantity, cart.quantity, 
                   (products.price * cart.quantity) AS subtotal 
            FROM cart 
            JOIN products ON cart.product_id = products.id 
            WHERE cart.user_id = ?`;

        const [items] = await db.query(sql, [user_id]);

        const updatedItems = items.map(item => ({
            ...item,
            //If stock is 5 or less, show "Limited Stock"
            stockStatus: item.stock_quantity <= 5 ? "Limited Stock" : "In Stock",
            isOutOfStock: item.stock_quantity < item.quantity
        }));

        //Grand Total calculation
        const grandTotal = items.reduce((total, item) => total + parseFloat(item.subtotal), 0);

        res.status(200).json({
            success: true,
            totalItems: items.length,
            grandTotal: grandTotal.toFixed(2),
            data: updatedItems
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

//Update Cart Quantity 
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
            return res.status(400).json({
                success: false,
                message: `Only ${check[0].stock_quantity} items available in stock.`
            });
        }

        await db.query("UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?", [quantity, id, user_id]);
        res.status(200).json({ success: true, message: "Quantity updated successfully." });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

//Delete item from cart
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