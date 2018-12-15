'use strict';
/**
 * Imports
 */
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const { upload } = require('./diskstorage');
const job = require('./core/cron');
const { auth: { API_KEY }, env } = require('./config');
const { promisify } = require('util');
const morgan = require('morgan');
/**
 * Constants
 */
const DOMAIN = 'http://localhost:3000/'; // Mind the training slash (/)

const readFileAsync = promisify(fs.readFile);

express.response.sendFile = promisify(express.response.sendFile);

const uploadsPath = (childPath = '') => {
    return path.resolve(__dirname, 'uploads', childPath);
};

const isAuthorizedUser = currentKey => {
    if (!currentKey) {
        return 401;
    } else if (currentKey !== API_KEY) {
        return 403;
    } else {
        return 200;
    }
};

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

if (env === 'PRODUCTION') {
    job.start();
}
/**
 * POST method to upload file
 */
app.post('/', (req, res) => {
    const API_KEY_HEADER = req.get('api-key');
    const responseStatus = isAuthorizedUser(API_KEY_HEADER);
    if (responseStatus === 200) {
        upload(req, res, function (err) {
            if (err) {
                res.json({ key: 'Something went wrong', err });
            }
            const url = `${DOMAIN}${req.file.url}`;
            res.end(url);
        });
    } else {
        res.sendStatus(responseStatus).end();
    }
});

app.get('/favicon.ico', (req, res) => res.sendFile(uploadsPath('../favicon.ico')));

app.get('/:file', (req, res, next) => {
    console.log(req.params);
    const requestedFile = req.params.file;
    readFileAsync(uploadsPath(requestedFile))
        .then(() => {
            res.sendFile(uploadsPath(requestedFile))
                .then(() => {
                    console.log('File sent');
                })
                .catch(fileUploadError => {
                    console.error('Error while sending the file', fileUploadError);
                    res.end('Error while sending file, please contact admin');
                });
        })
        .catch(readErr => {
            console.error('File reading Error', readErr);
            res.end('File not found');
        });
});

app.listen(3000, () => console.log(`Server started at ${DOMAIN}`));
