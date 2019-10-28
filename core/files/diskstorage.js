'use strict';

const multer = require('multer');
const path = require('path');
const db = require('../db');
const { existsSync, mkdirSync } = require('fs');
const auth = require('../auth');
const { uploadpath } = require('../../config');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const [username, , domain] = auth(req.get('api-key'));
        file.domain = domain;
        const uniquePath = path.resolve(uploadpath, username);
        const rootPath = path.resolve(uploadpath);
        if (!existsSync(rootPath)) {
            mkdirSync(rootPath);
        }
        if (!existsSync(uniquePath)) {
            mkdirSync(uniquePath);
        }
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
    storage
}).single('file');
