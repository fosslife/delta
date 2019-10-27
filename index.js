'use strict';
/**
 * Imports
 */
const express = require('express');
const app = express();
const path = require('path');
const { promisify } = require('util');
const db = require('./core/db');
const logger = require('./core/logger');

const { NODE_ENV: env } = process.env;
const uploads = require('./routes/router');

/**
 * Middlewares and inits
 */
db.incrby('index', 1000); // Initialize index by 1000
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

express.response.sendFile = promisify(express.response.sendFile);

const uploadsPath = (childPath = '') => {
    return path.resolve(__dirname, 'uploads', childPath);
};

if (env === 'production') {
    const job = require('./core/cron');
    job.start();
    logger.info('Cronjob starting in production mode');
}
/**
 * Router
 */

app.get('/favicon.ico', (req, res) =>
    res.sendFile(uploadsPath('../favicon.ico'))
);

app.use('/', uploads);

app.listen(3000, () =>
    // eslint-disable-next-line
    console.log('Server started at port 3000')
);
