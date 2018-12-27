'use strict';

const multer = require('multer');
const path = require('path');
const reqLib = require('app-root-path').require;
const { encode } = reqLib('core/urls/shortURL');
const db = reqLib('core/db');
const storage = multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'uploads'),
    filename: (req, file, cb) => {
        const uid = db.get('uniqueID').value();
        const id = encode(uid);
        db.set('uniqueID', uid + 1).write();
        file.url = id; // + path.extname(file.originalname);
        cb(null, id + path.extname(file.originalname)); //
    }
});

exports.upload = multer({
    storage
}).single('file');
