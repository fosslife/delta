'use strict';

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
        logger.info(`User is authorised`);
        const specialURL = req.body.custom;
        const isURL = validURL.isWebUri(URL);
        if (isURL) {
            logger.info(`User has given valid URL`);
            // part of URL either custom or incremented-auto-url
            const customOrAuto = specialURL || (await db.spop('genurls'));
            await db.publish('removed', 'remove');
            const fullURL = specialURL
                ? `${domain}${customOrAuto}`
                : `${domain}${customOrAuto}`;
            logger.info(`Got shortUrl ${customOrAuto}. updating DB`);
            await db.hset(
                `short:${customOrAuto}`,
                'original',
                URL,
                'type',
                'url'
            );
            if (req.body.pass) {
                await db.hset(
                    `short:${customOrAuto}`,
                    'password',
                    req.body.pass
                );
            }
            res.end(`${fullURL}\n`);
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
