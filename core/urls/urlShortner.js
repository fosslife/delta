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
        logger.info(`User is authorised`);
        const specialURL = req.body.custom;
        const isURL = validURL.isWebUri(URL);
        if (isURL) {
            logger.info(`User has given valid URL`);
            const uid = await db.get('index');
            // part of URL either custom or incremented-auto-url
            const customOrAuto = specialURL || encode(uid);
            const fullURL = specialURL
                ? `${domain}${customOrAuto}`
                : `${domain}${customOrAuto}`;
            const prevExists = await db.sismember('urls', customOrAuto);
            if (prevExists) {
                if (specialURL) {
                    logger.info(`Previous Custom URL exists, aborting`);
                    res.end(
                        `URL with ID ${customOrAuto} already exists. Try another custom path\n`
                    );
                } else {
                    logger.info(`URLs clashed, impossible tho!`);
                    await db.incr('index');
                    // Can give specific message but don't want user to know that URL with
                    // same ID already exists as it's random not custom. So generic error.
                    res.end(
                        `Error occurred, try again. If error persists, file an Issue`
                    );
                }
            } else {
                logger.info(`Got shortUrl ${customOrAuto}. updating DB`);
                await db.hset(
                    `short:${customOrAuto}`,
                    'original',
                    URL,
                    'type',
                    'url'
                );
                await db.incr('index');
                await db.sadd('urls', customOrAuto);
                res.end(`${fullURL}\n`);
            }
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
