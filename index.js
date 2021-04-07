'use strict';
/**
 * Imports
 */
const express = require('express');
const app = express();
const helmet = require('helmet');
const { existsSync, mkdirSync } = require('fs');
const path = require('path');
const { promisify } = require('util');
const { port, uploadpath, users } = require('./config');
const logger = require('./core/logger');
// const { resolve } = require('path');
const { NODE_ENV: env } = process.env;
const uploads = require('./routes/router');
// const exphbs = require('express-handlebars');

const isProduction = env === 'production';
/**
 * Middlewares and inits
 */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            'script-src': ["'self'", "'unsafe-inline'"]
        }
    })
);

express.response.sendFile = promisify(express.response.sendFile);

if (isProduction) {
    const job = require('./core/cron');
    job.start();
    logger.info('Cronjob starting in production mode');
}
/**
 * Router
 */

if (isProduction) {
    app.use(express.static('./client/build'));
}

app.use('/', uploads);

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(port, () =>
    // eslint-disable-next-line
    console.log(`Server started at port ${port}`)
);

// bootstrap folders/files etc.
(() => {
    if (!existsSync(uploadpath)) {
        mkdirSync(uploadpath);
    }
    const usernames = users.reduce((acc, curr) => [...acc, curr[0]], []);
    for (const u of usernames) {
        const uniquePath = path.resolve(uploadpath, u);
        if (!existsSync(uniquePath)) {
            mkdirSync(uniquePath);
        }
    }
})();

process.on('unhandledRejection', e => {
    logger.error(e);
});

process.on('uncaughtException', e => {
    logger.error(e);
});
