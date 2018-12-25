const { encode } = require('./shortURL');

const urlShortener = (req, res) => {
    const URL = req.body.url;
    res.end(encode(URL.length));
};

module.exports = urlShortener;
