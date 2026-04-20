const crypto = require('crypto');

exports.initiateEsewaPayment = async (req, res) => {
    try {
        const { amount, orderId } = req.body;
        // eSewa Test Credentials
        const product_code = "EPAYTEST";
        const secretKey = "8g8M9DGb22302682";
        const transaction_uuid = `${orderId}-${Date.now()}`;

        const data = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};