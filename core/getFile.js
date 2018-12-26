const { promisify } = require('util');
const readFileAsync = promisify(require('fs').readFile);
const { resolve } = require('path');
const logger = require('./logger');

const uploadsPath = (childPath = '') => {
    return resolve(__dirname, '..', 'uploads', childPath);
};

const getFile = (filename, req, res) => {
    readFileAsync(uploadsPath(filename))
        .then((f) => {
            res.sendFile(uploadsPath(filename))
                .then(() => {
                    logger.info('File sent ' + filename);
                })
                .catch(fileUploadError => {
                    logger.error('Error while sending the file ' + fileUploadError);
                    res.end('Error while sending file, please contact admin');
                });
        })
        .catch(readErr => {
            logger.error('File reading Error ' + readErr);
            res.end('File not found');
        });
};

module.exports = getFile;
