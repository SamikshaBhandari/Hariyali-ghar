module.exports = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    const role = (req.user.role || '').toString().toLowerCase();
    if (role === 'admin') return next();
    return res.status(403).json({ success: false, message: 'Admin access required' });
};