const { promisify } = require('util');
const upload = promisify(require('./diskstorage').upload);
const isAuthorizedUser = require('../isAuthorizedUser');
const logger = require('../logger');
const db = require('../db');
const { env, domainUrl } = require('../../config');

const DOMAIN = env === 'PROD' ? domainUrl : 'http://localhost:3000/';

const fileUploader = (req, res) => {
    const API_KEY_HEADER = req.get('api-key');
    const responseStatus = isAuthorizedUser(API_KEY_HEADER);
    if (responseStatus === 200) {
        upload(req, res)
            .then(() => {
                const originalName = req.file.originalname;
                const shortened = req.file.url;
                const filename = req.file.filename;
                logger.info('Uploading ' + JSON.stringify(originalName) + ' as ' + shortened);
                db
                    .get('collection')
                    .push({ 'originalName': originalName, 'short': shortened, 'type': 'file', 'filename': filename })
                    .write();
                const url = `${DOMAIN}${req.file.url}\n`;
                res.end(url);
            })
            .catch(err => {
                logger.error('Error while uploading the file ' + err);
                res.end('Something went wrong while uploading the file \n');
            });
    } else {
        logger.error('Unauthorized user visit ' + JSON.stringify(req.ipInfo));
        responseStatus === 401 ? res.status(responseStatus).send('Unauthorized \n') : res.status(responseStatus).send('Forbidden \n');
    }
};

module.exports = fileUploader;
