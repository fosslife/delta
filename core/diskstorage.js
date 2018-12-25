'use strict';

const multer = require('multer');
const shortid = require('shortid');
const path = require('path');
const { encode } = require('./shortURL');
const db = require('./db');

const storage = multer.diskStorage({
    destination: path.resolve(__dirname, '../uploads'),
    filename: (req, file, cb) => {
        // Use Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, lenthYouWant);
        // If you don't want shortId, 'pretty much' random + alphabets only
        // const id = shortid.generate();
        const uid = db.get('uniqueID').value();
        const id = encode(uid);
        console.log('generating id', uid);
        db.set('uniqueID', uid + 1).write();
        file.url = id + path.extname(file.originalname);
        cb(null, id + path.extname(file.originalname));
    }
});

exports.upload = multer({
    storage
}).single('file');
