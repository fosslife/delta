'use strict';

const { promisify } = require('util');
const upload = promisify(require('./diskstorage').upload);
const isAuthorizedUser = require('../isAuthorizedUser');
const logger = require('../logger');
const db = require('../db');

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
                const url = `${req.file.domain}${req.file.url}\n`;
                res.end(url);
            })
            .catch(err => {
                logger.error('Error while uploading the file ' + err);
                res.end(
                    'Something went wrong while uploading the file \n' + err
                );
            });
    } else {
        logger.error('Unauthorized user visit ' + JSON.stringify(req.ip));
        res.status(responseStatus).end('incorrect or missing API key');
    }
};

module.exports = fileUploader;
