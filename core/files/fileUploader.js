'use strict';

const { promisify } = require('util');
const upload = promisify(require('./diskstorage').upload);
const { isAuthorizedUser, getExpiry } = require('../utils');
const logger = require('../logger');
const db = require('../db');

const fileUploader = (req, res) => {
    const API_KEY_HEADER = req.get('api-key');
    const responseStatus = isAuthorizedUser(API_KEY_HEADER);
    if (responseStatus === 200) {
        const contentType = req.get('Accept') || 'text/plain';
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
                const url = `${req.file.domain}${req.file.url}`;
                if (contentType === 'application/json') {
                    res.json({
                        message: url,
                        status: 200
                    });
                } else {
                    res.end(`${url}\n`);
                }
            })
            .catch(err => {
                logger.error('Error while uploading the file ' + err);
                res.status(500).json({
                    message: 'Something went wrong while uploading the file'
                });
            });
    } else {
        logger.error('Unauthorized user visit ' + JSON.stringify(req.ip));
        res.status(responseStatus).end('incorrect or missing API key');
    }
};

module.exports = fileUploader;
