'use strict';
/**
 * Imports
 */
const express = require('express');
const app = express();
const path = require('path');
const reqLib = require('app-root-path').require;
const job = reqLib('core/cron');
const { env, domainUrl } = reqLib('config');
const { promisify } = require('util');
const db = reqLib('core/db');
const logger = reqLib('core/logger');
const expressip = require('express-ip');

const bodyParser = require('body-parser');

const uploads = reqLib('routes/uploads');

/**
 * Middlewares and inits
 */
const DOMAIN = env === 'PROD' ? domainUrl : 'http://localhost:3000/'; // Mind the trailing slash (/)
logger.info(`Server started at ${DOMAIN}`);

db.defaults({ collection: [], deleted: [], uniqueID: 10000 }).write();
app.use(expressip().getIpInfoMiddleware);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

express.response.sendFile = promisify(express.response.sendFile);

const uploadsPath = (childPath = '') => {
    return path.resolve(__dirname, 'uploads', childPath);
};

if (env === 'PROD') {
    job.start();
    logger.info('Cronjob starting in production mode');
}
/**
 * Router
 */

app.get('/favicon.ico', (req, res) => res.sendFile(uploadsPath('../favicon.ico')));

app.use('/', uploads);

app.listen(3000, () => console.log(`Server started at ${DOMAIN}`));
