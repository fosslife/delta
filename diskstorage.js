const multer = require('multer');
const shortid = require('shortid');
const path = require('path');

const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        const id = shortid.generate();
        file.url = id;
        cb(null, id + path.extname(file.originalname));
    }
});

exports.upload = multer({
    storage
}).single('file');
