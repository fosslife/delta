'use strict';

const { encode } = require('../urls/shortURL');
const db = require('../db');
const validURL = require('valid-url');
const isAuthorizedUser = require('../isAuthorizedUser');
const logger = require('../logger');
const auth = require('../auth');

const urlShortener = (req, res) => {
    const URL = req.body.url;
    const API_KEY_HEADER = req.get('api-key');
    /* It's a workaround, it could be better */
    const [, , domain] = auth(API_KEY_HEADER);
    const responseStatus = isAuthorizedUser(API_KEY_HEADER);
    if (responseStatus === 200) {
        const specialURL = req.body.custom;
        const isURL = validURL.isWebUri(URL);
        if (isURL) {
            const uid = db.get('uniqueID').value();
            if (specialURL) {
                const fullURL = `${domain}${specialURL}`;
                db.get('collection').push({ originalURL: URL, short: specialURL, type: 'url' }).write();
                db.set('uniqueID', uid + 1).write();
                res.write(fullURL);
                res.end('\n');
            } else {
                const shortenedURL = encode(uid);
                const fullURL = `${domain}${shortenedURL}`;
                db.get('collection').push({ originalURL: URL, short: shortenedURL, type: 'url' }).write();
                db.set('uniqueID', uid + 1).write();
                res.write(fullURL);
                res.end('\n');
            }
        } else {
            res.end('Please enter a valid http/https URL\n');
        }
    } else {
        logger.error('Unauthorized user visit ' + JSON.stringify(req.ip));
        responseStatus === 401 ? res.status(responseStatus).send('Unauthorized \n') : res.status(responseStatus).send('Forbidden \n');
    }
};

module.exports = urlShortener;
