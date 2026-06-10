const db = require('../db/db');

exports.placeOrder = async (req, res) => {
    const user_id = req.user.id;
    const { address, phone_number, payment_method } = req.body;
    let orderId;

    if (req.user && (req.user.role === 'admin' || req.user.role === 'Admin')) {
        return res.status(403).json({
            success: false,
            message: "Admin accounts are not allowed to place customer orders."
        });
    }

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

        // Stock Check 
        for (const item of cartItems) {
            if (item.stock_quantity < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Sorry, ${item.name} is out of stock.`
                });
            }
        }
        const subTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        const deliveryFee = subTotal >= 1500 ? 0 : 100;
        const totalAmount = subTotal + deliveryFee;


        const [orderResult] = await db.query(
            "INSERT INTO orders (user_id, total_amount, address, phone_number, payment_method, status) VALUES (?, ?, ?, ?, ?, 'Pending')",
            [user_id, totalAmount, address, phone_number, payment_method || 'COD']
        );

        orderId = orderResult.insertId;

        for (const item of cartItems) {
            // Move to order items
            await db.query(
                "INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)",
                [orderId, item.product_id, item.quantity, item.price]
            );

            // Update product stock
            await db.query(
                "UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?",
                [item.quantity, item.product_id]
            );
        }

        if (payment_method !== 'eSewa') {
            await db.query("DELETE FROM cart WHERE user_id = ?", [user_id]);
        }

        res.status(201).json({
            success: true,
            message: "Order placed successfully " + (payment_method || 'COD'),
            orderId: orderId,
            totalBill: totalAmount
        });
    } catch (err) {
        if (orderId) await db.query("UPDATE orders SET status = 'Cancelled' WHERE id = ?", [orderId]);
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
        //cancel order(user)
        const [order] = await db.query("SELECT * FROM orders WHERE id = ? AND user_id = ?", [id, user_id]);

        if (order.length === 0) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }

        if (order[0].status !== 'Pending') {
            return res.status(400).json({ success: false, message: "Only pending orders can be cancelled." });
        }

        const [items] = await db.query("SELECT product_id, quantity FROM order_items WHERE order_id = ?", [id]);
        for (const item of items) {
            await db.query("UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?", [item.quantity, item.product_id]);
        }

        const result = await db.query("UPDATE orders SET status = 'Cancelled' WHERE id = ?", [id]);
        console.log("Update Result:", result);

        res.status(200).json({ success: true, message: "Order cancelled successfully." });
    } catch (err) {
        console.error("Error in cancelOrder:", err);
        res.status(500).json({ success: false, message: "Could not cancel order." });
    }
};

//admin view all orders
exports.getAllOrdersForAdmin = async (req, res) => {
    try {
        const [allOrders] = await db.query(
            `SELECT o.*, u.fullname
             FROM orders o 
             JOIN users u ON o.user_id = u.id 
             ORDER BY o.created_at DESC`
        );

        res.status(200).json({
            success: true,
            data: allOrders
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching admin orders." });
    }
};

//admin order update and payment status
exports.updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status, payment_status } = req.body;

    try {
        const [order] = await db.query("SELECT status FROM orders WHERE id = ?", [id]);

        if (order.length === 0) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }

        const oldStatus = order[0].status;

        if (status === 'Cancelled' && oldStatus !== 'Cancelled') {
            const [items] = await db.query("SELECT product_id, quantity FROM order_items WHERE order_id = ?", [id]);
            for (const item of items) {
                await db.query(
                    "UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?",
                    [item.quantity, item.product_id]
                );
            }
        }
        else if (oldStatus === 'Cancelled' && status !== 'Cancelled') {
            const [items] = await db.query("SELECT product_id, quantity FROM order_items WHERE order_id = ?", [id]);
            for (const item of items) {
                await db.query(
                    "UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?",
                    [item.quantity, item.product_id]
                );
            }
        }

        await db.query(
            "UPDATE orders SET status = ?, payment_status = ? WHERE id = ?",
            [status, payment_status, id]
        );

        res.status(200).json({ success: true, message: "Order updated successfully." });
    } catch (err) {
        console.error("Error updating order status:", err);
        res.status(500).json({ success: false, message: "Failed to update status." });
    }
};

//delete order block
exports.deleteOrder = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    try {
        let query = "SELECT * FROM orders WHERE id = ?";
        let params = [id];
        if (user.role !== 'admin' && user.role !== 'Admin') {
            query += " AND user_id = ?";
            params.push(user.id);
        }
        const [order] = await db.query(query, params);
        if (order.length === 0) return res.status(404).json({ success: false, message: "Order not found or unauthorized." });

        await db.query("DELETE FROM orders WHERE id = ?", [id]);
        return res.status(200).json({ success: true, message: "Order deleted successfully." });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server Error." });
    }
};

// Admin Dashboard fetch
exports.getAdminDashboardStats = async (req, res) => {
    try {
        //Total Orders count
        const [[{ totalOrders }]] = await db.query("SELECT COUNT(*) AS totalOrders FROM orders");
        const [[{ pendingOrders }]] = await db.query("SELECT COUNT(*) AS pendingOrders FROM orders WHERE status = 'Pending'");

        //Total Users count
        const [[{ totalUsers }]] = await db.query("SELECT COUNT(*) AS totalUsers FROM users");

        // Safe check for new users count
        let newUsersThisWeek = 0;
        try {
            const [[{ count }]] = await db.query("SELECT COUNT(*) AS count FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)");
            newUsersThisWeek = count;
        } catch (e) { newUsersThisWeek = 0; }

        //Stock counts
        const [[{ lowStockCount }]] = await db.query("SELECT COUNT(*) AS lowStockCount FROM products WHERE stock_quantity > 0 AND stock_quantity <= 5");
        const [[{ outOfStockCount }]] = await db.query("SELECT COUNT(*) AS outOfStockCount FROM products WHERE stock_quantity = 0");

        //Total Revenue
        const [[{ totalRevenue }]] = await db.query(
            "SELECT IFNULL(SUM(total_amount), 0) AS totalRevenue FROM orders WHERE LOWER(payment_status) = 'paid'"
        );
        //Recent 5 orders list
        let recentOrders = [];
        try {
            const [orders] = await db.query(
                `SELECT o.id, u.fullname AS customer, o.total_amount AS total, o.status 
                 FROM orders o
                 JOIN users u ON o.user_id = u.id
                 ORDER BY o.created_at DESC LIMIT 5`
            );
            recentOrders = orders;
        } catch (e) { recentOrders = []; }

        //Low stock alert list
        const [stockAlerts] = await db.query(
            `SELECT name, stock_quantity AS count, 
             CASE WHEN stock_quantity = 0 THEN 'Out of Stock' ELSE 'Low Stock' END AS status
             FROM products 
             WHERE stock_quantity <= 5 
             LIMIT 5`
        );

        res.status(200).json({
            success: true,
            stats: {
                totalOrders,
                pendingOrders,
                totalUsers,
                newUsersThisWeek,
                lowStockCount,
                outOfStockCount,
                totalRevenue
            },
            recentOrders,
            stockAlerts
        });

    } catch (err) {
        console.error("Admin Dashboard Stats Controller Error:", err);
        res.status(500).json({ success: false, message: "Backend error while fetching stats." });
    }
};

module.exports = {
    placeOrder: exports.placeOrder,
    getMyOrders: exports.getMyOrders,
    getOrderDetails: exports.getOrderDetails,
    cancelOrder: exports.cancelOrder,
    getAllOrdersForAdmin: exports.getAllOrdersForAdmin,
    updateOrderStatus: exports.updateOrderStatus,
    deleteOrder: exports.deleteOrder,
    getAdminDashboardStats: exports.getAdminDashboardStats
};