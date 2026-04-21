const crypto = require('crypto');
const db = require('../db/db');

//Payment ko request suru garne ra database ma pending record rakhne
exports.initiateEsewaPayment = async (req, res) => {
    try {
        const { amount, orderId } = req.body;
        const [result] = await db.query(
            "INSERT INTO payments (order_id, payment_method, amount, status) VALUES (?, ?, ?, ?)",
            [orderId, 'esewa', amount, 'pending']
        );

        const payment_db_id = result.insertId;
        //eSewa Credentials 
        const product_code = "EPAYTEST";
        const secretKey = "8g8M9DGb22302682";

        const transaction_uuid = `${payment_db_id}-${Date.now()}`;
        const dataString = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
        const hash = crypto.createHmac('sha256', secretKey).update(dataString).digest('base64');

        res.json({
            success: true,
            payment_data: {
                amount,
                total_amount: amount,
                transaction_uuid,
                product_code,
                signature: hash,
                // React ko page jaha user firta aauchha
                success_url: "http://localhost:3000/payment-success",
                failure_url: "http://localhost:3000/payment-failure",
                signed_field_names: "total_amount,transaction_uuid,product_code",
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.verifyEsewaPayment = async (req, res) => {
    try {
        const { data } = req.body; //data send to encoded format

        //eSewa ko encoded data lai decode garne
        const decodedString = Buffer.from(data, 'base64').toString('utf-8');
        const decodedData = JSON.parse(decodedString);

        if (decodedData.status === "COMPLETE") {
            const payment_id = decodedData.transaction_uuid.split('-')[0];

            //Database update
            await db.query(
                "UPDATE payments SET status = ?, transaction_id = ?, payment_date = NOW() WHERE id = ?",
                ['paid', decodedData.transaction_code, payment_id]
            );

            res.json({ success: true, message: "Payment Verified and Database Updated!" });
        } else {
            res.status(400).json({ success: false, message: "Payment not completed" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};