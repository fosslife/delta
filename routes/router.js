'use strict';

const uploads = require('express').Router();
const db = require('../core/db');
const logger = require('../core/logger');
const fileUploader = require('../core/files/fileUploader');
const urlShortner = require('../core/urls/urlShortner');
const auth = require('basic-auth');

const cache = new Proxy(
    {},
    {
        set: (target, property, value) => {
            const totalKeys = Object.keys(target);
            if (totalKeys.length >= 50) {
                delete target[totalKeys[0]];
            }
            target[property] = value;
            return true;
        }
    }
);

uploads.post('/', (req, res) => {
    const requestBody = req.body;
    if (!requestBody.url) {
        logger.info('Uploading file');
        fileUploader(req, res);
    } else {
        logger.info('Shortening URL');
        urlShortner(req, res);
    }
});

uploads.get('/:link', async (req, res) => {
    const request = req.params.link;
    logger.info(`Serving file short:${request}`);
    if (cache[`short:${request}`]) {
        serve(cache[`short:${request}`], res);
    } else {
        const record = await db.hgetall(`short:${request}`);
        if (!record.expires) {
            // eslint thinks that it's a race condition. Smart.
            // but it's not. I update cache only when cache-miss happens.
            // eslint-disable-next-line
            cache[`short:${request}`] = record;
        }
        if (record.password) {
            const user = auth(req);
            if (!user || user.pass !== record.password) {
                res.set(
                    'WWW-Authenticate',
                    'Basic realm="url is protected by password"'
                );
                return res.status(401).send();
            } else {
                serve(record, res);
            }
        } else {
            serve(record, res);
        }
    }
});

function serve(record, res) {
    if (record.type === 'file') {
        const fileName = record.path;
        res.sendFile(fileName)
            .then(() => {
                logger.info('File sent ' + record.path);
            })
            .catch(fileUploadError => {
                logger.error('Error while sending the file ' + fileUploadError);
                res.end('Error while sending file, please contact admin');
            });
    } else if (record.type === 'url') {
        res.redirect(record.original);
    } else {
        res.end('Incorrect link or record is expired and cleaned by cron');
    }
}

module.exports = uploads;
