'use strict';
/**
 * Imports
 */
const express = require('express');
const app = express();
const helmet = require('helmet');
const { promisify } = require('util');
const db = require('./core/db');
const logger = require('./core/logger');
const { resolve } = require('path');
const { NODE_ENV: env } = process.env;
const uploads = require('./routes/router');
/**
 * Middlewares and inits
 */
// Initialize index by 1000
db.get('index').then(id => {
    if (!id) {
        db.incrby('index', 1000);
    }
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());

express.response.sendFile = promisify(express.response.sendFile);

if (env === 'production') {
    const job = require('./core/cron');
    job.start();
    logger.info('Cronjob starting in production mode');
}
/**
 * Router
 */

/**
 * Note that favicon is kinda important here
 * as all the routes are analogues /, /favicon, /:url are
 * same for express, so if /favicon fails, it will try to
 * search for /favicon in URLs instead :(
 */
app.get('/favicon.ico', (req, res) =>
    res.sendFile(resolve(__dirname, './favicon.png'))
);

app.use('/', uploads);

app.get('/', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain charset=us-ascii' });
    res.end('Hello\n');
});

app.listen(3000, () =>
    // eslint-disable-next-line
    console.log('Server started at port 3000')
);
