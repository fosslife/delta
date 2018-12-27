const { resolve } = require('path');
const reqLib = require('app-root-path').require;
const logger = reqLib('core/logger');

const uploadsPath = (childPath = '') => {
    return resolve(__dirname, '..', '..', 'uploads', childPath);
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
