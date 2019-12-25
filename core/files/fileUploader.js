'use strict';

const { promisify } = require('util');
const upload = promisify(require('./diskstorage').upload);
const { isAuthorizedUser } = require('../utils');
const logger = require('../logger');
const db = require('../db');
const { getExpiry } = require('../utils');

const fileUploader = (req, res) => {
    const API_KEY_HEADER = req.get('api-key');
    const responseStatus = isAuthorizedUser(API_KEY_HEADER);
    if (responseStatus === 200) {
        upload(req, res)
            .then(async () => {
                const shortened = req.file.url;
                const filepath = req.file.path;
                logger.info(`Uploading ${filepath} as ${shortened}`);
                await db.hset(
                    `short:${shortened}`,
                    'type',
                    'file',
                    'path',
                    filepath
                );
                if (req.body.pass) {
                    await db.hset(
                        `short:${shortened}`,
                        'password',
                        req.body.pass
                    );
                }
                if (req.body.expires) {
                    const duration = getExpiry(req.body.expires);
                    await db.expire(`short:${shortened}`, duration);
                    await db.hset(`short:${shortened}`, 'expires', duration);
                }
                const url = `${req.file.domain}${req.file.url}\n`;
                res.end(url);
            })
            .catch(err => {
                logger.error('Error while uploading the file ' + err);
                res.end('Something went wrong while uploading the file \n');
            });
    } else {
        logger.error('Unauthorized user visit ' + JSON.stringify(req.ip));
        res.status(responseStatus).end('incorrect or missing API key');
    }
};

module.exports = fileUploader;
