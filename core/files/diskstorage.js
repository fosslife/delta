'use strict';

const multer = require('multer');
const path = require('path');
const db = require('../db');
const { auth } = require('../utils');
const { uploadpath, maxFileSize, allowedExtentions } = require('../../config');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const [username, , domain] = auth(req.get('api-key'));
        file.domain = domain;
        const uniquePath = path.resolve(uploadpath, username);
        cb(null, uniquePath);
    },
    filename: async (req, file, cb) => {
        const id = await db.spop('genurls');
        await db.publish('removed', 'remove');
        file.url = id;
        cb(null, id + path.extname(file.originalname)); //
    }
});

exports.upload = multer({
    storage,
    fileFilter: function(req, file, callback) {
        const ext = path.extname(file.originalname);
        if (!allowedExtentions.includes(ext)) {
            callback(new TypeError('Uploaded file type is not allowed\n'));
        }
        callback(null, true);
    },
    limits: {
        fileSize: maxFileSize * 1000000
    }
}).single('file');
