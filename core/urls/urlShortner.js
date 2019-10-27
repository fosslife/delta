'use strict';

const { encode } = require('../urls/shortURL');
const db = require('../db');
const validURL = require('valid-url');
const isAuthorizedUser = require('../isAuthorizedUser');
const logger = require('../logger');
const auth = require('../auth');

const urlShortener = async (req, res) => {
    const URL = req.body.url;
    const API_KEY_HEADER = req.get('api-key');
    /* It's a workaround, it could be better */
    const [, , domain] = auth(API_KEY_HEADER);
    const responseStatus = isAuthorizedUser(API_KEY_HEADER);
    if (responseStatus === 200) {
        const specialURL = req.body.custom;
        const isURL = validURL.isWebUri(URL);
        if (isURL) {
            const uid = await db.get('index');
            // part of URL either custom or incremented-auto-url
            const customOrAuto = specialURL || encode(uid);
            const fullURL = specialURL
                ? `${domain}${customOrAuto}`
                : `${domain}${customOrAuto}`;
            await db.hset(
                `short:${customOrAuto}`,
                'original',
                URL,
                'type',
                'url'
            );
            await db.incr('index');
            res.write(fullURL);
            res.end('\n'); // Workaround for zsh adding '%' at the end
        } else {
            logger.error('User gave invalid URL');
            res.end('Please enter a valid resource URL\n');
        }
    } else {
        logger.error('Unauthorized user visit ' + JSON.stringify(req.ip));
        res.status(responseStatus).end('\n');
    }
};

module.exports = urlShortener;
