'use strict';

const uploads = require('express').Router();
const db = require('../core/db');
const logger = require('../core/logger');
const fileUploader = require('../core/files/fileUploader');
const urlShortner = require('../core/urls/urlShortner');
const getFile = require('../core/files/getFile');
const auth = require('basic-auth');

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
    logger.info('Serving file ' + request);
    const record = await db.hgetall(`short:${request}`);
    logger.info('Found record' + JSON.stringify(record));

    // TODO: remove duplicate else parts
    if (record.password) {
        const user = auth(req);
        if (!user || user.pass !== record.password) {
            res.set(
                'WWW-Authenticate',
                'Basic realm="url is protected by password"'
            );
            return res.status(401).send();
        } else {
            if (record.type === 'file') {
                const fileName = record.path;
                getFile(fileName, req, res);
            } else if (record.type === 'url') {
                res.redirect(record.original);
            } else {
                res.end(
                    'Incorrect link or record is expired and cleaned by cron'
                );
            }
        }
    } else {
        if (record.type === 'file') {
            const fileName = record.path;
            getFile(fileName, req, res);
        } else if (record.type === 'url') {
            res.redirect(record.original);
        } else {
            res.end('Incorrect link or record is expired and cleaned by cron');
        }
    }
});

module.exports = uploads;
