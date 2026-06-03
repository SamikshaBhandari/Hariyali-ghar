const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../db/db');

function secureCompare(a, b) {
    try {
        const bufA = Buffer.from(a, 'utf8');
        const bufB = Buffer.from(b, 'utf8');
        if (bufA.length !== bufB.length) return false;
        return crypto.timingSafeEqual(bufA, bufB);
    } catch (e) {
        return false;
    }
}

router.post('/payment', async (req, res) => {
    try {
        const signature = (req.headers['x-signature'] || '').toString();
        if (!req.rawBody) return res.status(400).send('No raw body');

        const expected = crypto.createHmac('sha256', process.env.WEBHOOK_SECRET || '')
            .update(req.rawBody)
            .digest('hex');

        if (!secureCompare(expected, signature)) {
            return res.status(400).send('Invalid signature');
        }

        const rawString = req.rawBody.toString('utf8');
        let payload;
        try {
            payload = JSON.parse(rawString);
        } catch (err) {
            payload = { raw: rawString };
        }

        const eventId = payload.id || null;
        const eventType = payload.type || payload.event || 'unknown';
        const checkSql = eventId
            ? 'SELECT id FROM webhook_events WHERE event_id = ? LIMIT 1'
            : 'SELECT id FROM webhook_events WHERE signature = ? LIMIT 1';
        const checkParam = eventId || signature;

        const [existing] = await db.query(checkSql, [checkParam]);
        if (existing && existing.length) {
            return res.status(200).send('already processed');
        }

        const insertSql = 'INSERT INTO webhook_events (event_id, event_type, payload, signature, processed) VALUES (?, ?, ?, ?, 0)';
        await db.query(insertSql, [eventId, eventType, JSON.stringify(payload), signature]);

        // Process event (example: mark order paid)
        if (eventType === 'order.paid' || eventType === 'payment_intent.succeeded') {
            const orderId = payload.orderId || (payload.data && payload.data.object && payload.data.object.orderId);
            if (orderId) {
                const updSql = 'UPDATE orders SET status = ? WHERE id = ?';
                await db.query(updSql, ['paid', orderId]);
            }
        }

        const markSql = 'UPDATE webhook_events SET processed = 1 WHERE event_id = ? OR signature = ?';
        await db.query(markSql, [eventId, signature]);

        return res.status(200).send('received');
    } catch (e) {
        console.error('Webhook route error:', e);
        return res.status(500).send('server error');
    }
});

module.exports = router;