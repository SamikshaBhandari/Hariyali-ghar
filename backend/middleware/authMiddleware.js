const jwt = require('jsonwebtoken');
require('dotenv').config();
exports.authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access Denied: No Token Provided!"
            });
        }
        const secretKey = process.env.JWT_SECRET;
        if (!secretKey) {
            console.error("ERROR: JWT_SECRET is missing in .env file");
            return res.status(500).json({
                success: false,
                message: "Internal Server Error: Security Key not configured."
            });
        }
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();

    } catch (err) {
        return res.status(403).json({
            success: false,
            message: "Invalid or Expired Token",
            error: err.message
        });
    }
}; 
