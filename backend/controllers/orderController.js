const db = require('../db/db');

exports.placeOrder = async (req, res) => {
    const user_id = req.user.id;
    const { address, phone_number, payment_method } = req.body;

    if (!address || !phone_number) {
        return res.status(400).json({ success: false, message: "Address and Phone Number are required." });
    }

    try {
        const [cartItems] = await db.query(
            `SELECT c.product_id, c.quantity, p.price, p.stock_quantity, p.name 
             FROM cart c 
             JOIN products p ON c.product_id = p.id 
             WHERE c.user_id = ?`,
            [user_id]
        );

        if (cartItems.length === 0) {
            return res.status(400).json({ success: false, message: "Your cart is empty." });
        }

        //Stock Check 
        for (const item of cartItems) {
            if (item.stock_quantity < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Sorry, ${item.name} is out of stock.`
                });
            }
        }

        const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

        const [orderResult] = await db.query(
            "INSERT INTO orders (user_id, total_amount, address, status) VALUES (?, ?, ?, 'Pending')",
            [user_id, totalAmount, address]
        );

        const orderId = orderResult.insertId;

        for (const item of cartItems) {
            //Move to order_items
            await db.query(
                "INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)",
                [orderId, item.product_id, item.quantity, item.price]
            );

            //Update product stock
            await db.query(
                "UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?",
                [item.quantity, item.product_id]
            );
        }

        //Empty the cart
        await db.query("DELETE FROM cart WHERE user_id = ?", [user_id]);
        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            orderId: orderId,
            totalBill: totalAmount
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error: Could not place order." });
    }
};

exports.getMyOrders = async (req, res) => {
    const user_id = req.user.id;
    try {
        const [orders] = await db.query(
            "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
            [user_id]
        );
        res.status(200).json({ success: true, data: orders });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch orders." });
    }
};

exports.getOrderDetails = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;

    try {
        //Validation,Check if this order belongs to the user
        const [order] = await db.query("SELECT * FROM orders WHERE id = ? AND user_id = ?", [id, user_id]);

        if (order.length === 0) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }

        const [items] = await db.query(
            `SELECT oi.*, p.name, p.image_url 
             FROM order_items oi 
             JOIN products p ON oi.product_id = p.id 
             WHERE oi.order_id = ?`,
            [id]
        );

        res.status(200).json({
            success: true,
            orderSummary: order[0],
            items: items
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching order details." });
    }
};

exports.cancelOrder = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;

    try {
        //Only cancel if order is Pending and belongs to user
        const [order] = await db.query("SELECT * FROM orders WHERE id = ? AND user_id = ?", [id, user_id]);

        if (order.length === 0) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }

        if (order[0].status !== 'Pending') {
            return res.status(400).json({ success: false, message: "Only pending orders can be cancelled." });
        }

        await db.query("UPDATE orders SET status = 'Cancelled' WHERE id = ?", [id]);

        res.status(200).json({ success: true, message: "Order cancelled successfully." });
    } catch (err) {
        res.status(500).json({ success: false, message: "Could not cancel order." });
    }
};
module.exports = {
    placeOrder: exports.placeOrder,
    getMyOrders: exports.getMyOrders,
    getOrderDetails: exports.getOrderDetails,
    cancelOrder: exports.cancelOrder
};