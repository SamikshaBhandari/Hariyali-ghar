const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db/db');
const productController = require('./controllers/productController');
const authController=require('./controllers/authController');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/images', express.static('image'));
app.use('/api/products', productController);
app.use('/api/auth',authController);

const PORT = process.env.PORT || 5000;

db.query("SELECT 1")
    .then(() => {
        console.log("Database Connected Successfully.");
                app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("Database Connection Failed.", err);
    });

app.get('/dbtest', (req, res) => {
    res.send("Backend server is running successfully.");
});