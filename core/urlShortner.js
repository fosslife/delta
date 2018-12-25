const { encode } = require('./shortURL');
const db = require('./db');
const { env, domainUrl } = require('../config');
const DOMAIN = env === 'PROD' ? domainUrl : 'http://localhost:3000/';

const urlShortener = (req, res) => {
    const URL = req.body.url;
    const uid = db.get('uniqueID').value();
    const shortURL = encode(uid);
    const id = db.get('urls').size() + 1;
    db.get('urls').push({ id, originalURL: URL, shortenedURL: shortURL }).write();
    db.set('uniqueID', uid + 1).write();
    res.write(`${DOMAIN}${shortURL}`);
    res.end('\n');
};

module.exports = urlShortener;
