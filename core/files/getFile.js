'use strict';

const { resolve } = require('path');
const { uploadpath } = require('../../config');
const logger = require('../logger');

const uploadsPath = (childPath = '') => {
    return resolve(uploadpath, childPath);
};

const getFile = (filename, req, res) => {
    res.sendFile(uploadsPath(filename))
        .then(() => {
            logger.info('File sent ' + filename);
        })
        .catch(fileUploadError => {
            logger.error('Error while sending the file ' + fileUploadError);
            res.end('Error while sending file, please contact admin');
        });
};

module.exports = getFile;
