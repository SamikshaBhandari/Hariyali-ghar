const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'image')),
    filename: (req, file, cb) => {
        const name = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
        cb(null, name);
    }
});

module.exports = multer({ storage });