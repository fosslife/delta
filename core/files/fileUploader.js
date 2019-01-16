const { promisify } = require('util');
const reqLib = require('app-root-path').require;
const upload = promisify(reqLib('core/files/diskstorage').upload);
const isAuthorizedUser = reqLib('core/isAuthorizedUser');
const logger = reqLib('core/logger');
const db = reqLib('core/db');

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
                const url = `${req.file.url}\n`;
                res.end(url);
            })
            .catch(err => {
                logger.error('Error while uploading the file ' + err);
                res.end('Something went wrong while uploading the file \n' + err);
            });
    } else {
        logger.error('Unauthorized user visit ' + JSON.stringify(req.ipInfo));
        responseStatus === 401 ? res.status(responseStatus).send('Unauthorized \n') : res.status(responseStatus).send('Forbidden \n');
    }
};

module.exports = fileUploader;
