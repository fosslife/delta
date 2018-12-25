'use strict';
/**
 * Imports
 */
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const job = require('./core/cron');
const { env, domainUrl } = require('./config');
const { promisify } = require('util');
const db = require('./core/db');
const logger = require('./core/logger');
const expressip = require('express-ip');
const fileUploader = require('./core/fileUploader');
const bodyParser = require('body-parser');
const urlShortner = require('./core/urlShortner');

/**
 * Middlewares and inits
 */
const DOMAIN = env === 'PROD' ? domainUrl : 'http://localhost:3000/'; // Mind the trailing slash (/)
logger.info(`Server started at ${DOMAIN}`);

db.defaults({ collection: [], uniqueID: 10000 }).write();
app.use(expressip().getIpInfoMiddleware);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const readFileAsync = promisify(fs.readFile);

express.response.sendFile = promisify(express.response.sendFile);

const uploadsPath = (childPath = '') => {
    return path.resolve(__dirname, 'uploads', childPath);
};

if (env === 'PROD') {
    job.start();
    logger.info('Cronjob starting in production mode');
}
/**
 * POST method to upload file
 */
app.post('/', (req, res) => {
    const requestBody = req.body;
    if (!requestBody.url) {
        logger.info('Uploading file');
        fileUploader(req, res);
    } else {
        logger.info('Shortening URL');
        urlShortner(req, res);
    }
});

app.get('/favicon.ico', (req, res) => res.sendFile(uploadsPath('../favicon.ico')));

app.get('/:file', (req, res, next) => {
    // console.log(req.headers['user-agent']);
    const requestedFile = req.params.file;
    logger.info('Serving file ' + requestedFile);
    // const record = db.get()
    readFileAsync(uploadsPath(requestedFile))
        .then(() => {
            res.sendFile(uploadsPath(requestedFile))
                .then(() => {
                    logger.info('File sent ' + requestedFile);
                })
                .catch(fileUploadError => {
                    logger.error('Error while sending the file ' + fileUploadError);
                    res.end('Error while sending file, please contact admin');
                });
        })
        .catch(readErr => {
            logger.error('File reading Error ' + readErr);
            res.end('File not found');
        });
});

app.listen(3000, () => console.log(`Server started at ${DOMAIN}`));
