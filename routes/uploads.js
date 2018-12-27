const uploads = require('express').Router();
const reqLib = require('app-root-path').require;
const db = reqLib('core/db');
const logger = reqLib('core/logger');
const fileUploader = reqLib('core/files/fileUploader');
const urlShortner = reqLib('core/urls/urlShortner');
const getFile = reqLib('core/files/getFile');

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

uploads.get('/:file', (req, res, next) => {
    // console.log(req.headers['user-agent']);
    const requestedFile = req.params.file;
    logger.info('Serving file ' + requestedFile);
    const record = db.get('collection').find({ short: requestedFile }).value();
    if (record && record.type === 'file') {
        const fileName = record.filename;
        getFile(fileName, req, res);
    } else if (record && record.type === 'url') {
        res.redirect(record.originalURL);
    } else {
        res.end('Cannot find the specified record');
    }
});

module.exports = uploads;
