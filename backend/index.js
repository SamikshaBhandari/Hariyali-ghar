const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db/db');
const productRoute = require('./routes/productRoute');
const authRoute = require('./routes/authRoute');
const cartRoute = require('./routes/cartRoute');
const orderRoute = require('./routes/orderRoute');
const categoryRoute = require('./routes/categoryRoute')
const reviewRoute = require('./routes/reviewRoute');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/images', express.static('image'));
app.use('/api/products', productRoute);
app.use('/api/auth', authRoute);
app.use('/api/cart', cartRoute);
app.use('/api/orders', orderRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/reviews', reviewRoute);

const PORT = process.env.PORT || 5000;

db.query("SELECT 1")
    .then(() => {
        console.log("Database Connected Successfully");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("Database Connection Failed", err);
    });

app.get('/dbtest', (req, res) => {
    res.send("Backend server is running successfully");
});

