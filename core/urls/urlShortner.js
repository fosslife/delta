const reqLib = require('app-root-path').require;
const { encode } = reqLib('core/urls/shortURL');
const db = reqLib('core/db');
const { env, domainUrl } = reqLib('config');
const DOMAIN = env === 'PROD' ? domainUrl : 'http://localhost:3000/';
const validURL = require('valid-url');

const urlShortener = (req, res) => {
    const URL = req.body.url;
    const specialURL = req.body.custom;
    const isURL = validURL.isWebUri(URL);
    if (isURL) {
        const uid = db.get('uniqueID').value();
        if (specialURL) {
            const fullURL = `${DOMAIN}${specialURL}`;
            db.get('collection').push({ originalURL: URL, short: specialURL, type: 'url' }).write();
            res.write(fullURL);
            res.end('\n');
        } else {
            const shortenedURL = encode(uid);
            const fullURL = `${DOMAIN}${shortenedURL}`;
            db.get('collection').push({ originalURL: URL, short: shortenedURL, type: 'url' }).write();
            res.write(fullURL);
            res.end('\n');
        }
        db.set('uniqueID', uid + 1).write();
    } else {
        res.end('Please enter a valid http/https URL\n');
    }
};

module.exports = urlShortener;
