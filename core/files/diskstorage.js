'use strict';

const multer = require('multer');
const path = require('path');
const reqLib = require('app-root-path').require;
const { encode } = reqLib('core/urls/shortURL');
const db = reqLib('core/db');
const { existsSync, mkdirSync } = require('fs');

const storage = multer.diskStorage({
    // path.resolve(__dirname, '..', '..', 'uploads')
    destination: (req, file, cb) => {
        const uniquePath = path.resolve(__dirname, '..', '..', 'uploads', req.get('api-key'));
        const rootPath = path.resolve(__dirname, '..', '..', 'uploads');
        if (!existsSync(rootPath)) {
            mkdirSync(rootPath);
        }
        if (!existsSync(uniquePath)) {
            mkdirSync(uniquePath);
        }
        cb(null, uniquePath);
    },
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
