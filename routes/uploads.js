'use strict';

const uploads = require('express').Router();
const db = require('../core/db');
const logger = require('../core/logger');
const fileUploader = require('../core/files/fileUploader');
const urlShortner = require('../core/urls/urlShortner');
const getFile = require('../core/files/getFile');

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

uploads.get('/:file', (req, res) => {
    // console.log(req.headers['user-agent']);
    const requestedFile = req.params.file;
    logger.info('Serving file ' + requestedFile);
    const record = db.get('collection').find({ short: requestedFile }).value();
    logger.info('Found record' + JSON.stringify(record));
    if (record && record.type === 'file') {
        const fileName = record.filepath;
        getFile(fileName, req, res);
    } else if (record && record.type === 'url') {
        res.redirect(record.originalURL);
    } else {
        res.end('Cannot find the specified record');
    }
});

module.exports = uploads;
