'use strict';
/**
 * Imports
 */
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const { upload } = require('./core/diskstorage');
const job = require('./core/cron');
const { env, domainUrl } = require('./config');
const isAuthorizedUser = require('./core/isAuthorizedUser');
const { promisify } = require('util');
const morgan = require('morgan');
/**
 * Constants
 */
const DOMAIN = env === 'PROD' ? domainUrl : 'http://localhost:3000/'; // Mind the training slash (/)

const readFileAsync = promisify(fs.readFile);

express.response.sendFile = promisify(express.response.sendFile);

const uploadsPath = (childPath = '') => {
    return path.resolve(__dirname, 'uploads', childPath);
};

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

if (env === 'PROD') {
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
                console.error('Error while uploading the file', err);
                res.end('Something went wrong while uploading the file');
            }
            const url = `${DOMAIN}${req.file.url}\n`;
            res.end(url);
        });
    } else {
        responseStatus === 401 ? res.status(responseStatus).send('Unauthorized \n') : res.status(responseStatus).send('Forbidden \n');
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
