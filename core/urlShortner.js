const { encode } = require('./shortURL');
const db = require('./db');

const urlShortener = (req, res) => {
    const URL = req.body.url;
    db.get('files').inc().value();
    res.end(encode(URL.length));
};

module.exports = urlShortener;
