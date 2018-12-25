const { encode } = require('./shortURL');
const db = require('./db');
const { env, domainUrl } = require('../config');
const DOMAIN = env === 'PROD' ? domainUrl : 'http://localhost:3000/';
const validURL = require('valid-url');

const urlShortener = (req, res) => {
    const URL = req.body.url;
    const specialURL = req.body.custom;
    const isURL = validURL.isWebUri(URL);
    if (isURL) {
        const uid = db.get('uniqueID').value();
        const id = db.get('urls').size() + 1;
        if (specialURL) {
            const fullURL = `${DOMAIN}${specialURL}`;
            db.get('urls').push({ id, originalURL: URL, shortenedURL: fullURL }).write();
            res.write(fullURL);
            res.end('\n');
        } else {
            const shortenedURL = encode(uid);
            const fullURL = `${DOMAIN}${shortenedURL}`;
            db.get('urls').push({ id, originalURL: URL, shortenedURL: fullURL }).write();
            res.write(fullURL);
            res.end('\n');
        }
        db.set('uniqueID', uid + 1).write();
    } else {
        res.end('Please enter a valid http/https URL\n');
    }
};

module.exports = urlShortener;
