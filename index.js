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
const isAuthorizedUser = require('./core/isAuthorizedUser');
const { promisify } = require('util');
const upload = promisify(require('./core/diskstorage').upload);
const db = require('./core/db');
const logger = require('./core/logger');
const expressip = require('express-ip');

db.defaults({ files: [] }).write();
app.use(expressip().getIpInfoMiddleware);
/**
 * Constants
 */
const DOMAIN = env === 'PROD' ? domainUrl : 'http://localhost:3000/'; // Mind the trailing slash (/)
logger.info(`Server started at ${DOMAIN}`);

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
    const API_KEY_HEADER = req.get('api-key');
    const responseStatus = isAuthorizedUser(API_KEY_HEADER);
    if (responseStatus === 200) {
        upload(req, res)
            .then(() => {
                const originalName = req.file.originalname;
                const shortened = req.file.filename;
                logger.info('Uploading ' + JSON.stringify(originalName) + ' as ' + shortened);
                db
                    .get('files')
                    .push({ 'originalName': originalName, 'shortened': shortened })
                    .write();
                const url = `${DOMAIN}${req.file.url}\n`;
                res.end(url);
            })
            .catch(err => {
                logger.error('Error while uploading the file ' + err);
                res.end('Something went wrong while uploading the file');
            });
    } else {
        logger.error('Unauthorized user visit ' + JSON.stringify(req.ipInfo));
        responseStatus === 401 ? res.status(responseStatus).send('Unauthorized \n') : res.status(responseStatus).send('Forbidden \n');
    }
});

app.get('/favicon.ico', (req, res) => res.sendFile(uploadsPath('../favicon.ico')));

app.get('/:file', (req, res, next) => {
    // console.log(req.headers['user-agent']);
    const requestedFile = req.params.file;
    logger.info('Serving file ' + requestedFile);
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
