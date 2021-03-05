'use strict';

const db = require('../db');
const validURL = require('valid-url');
const logger = require('../logger');
const { auth, getExpiry, isAuthorizedUser } = require('../utils');

const urlShortener = async (req, res) => {
    const URL = req.body.url;
    logger.info('URL to shorten', URL);
    const API_KEY_HEADER = req.get('api-key');
    /* It's a workaround, it could be better */
    const [, , domain] = auth(API_KEY_HEADER);
    logger.info('Domain found', domain);
    const responseStatus = isAuthorizedUser(API_KEY_HEADER);
    if (responseStatus === 200) {
        logger.info('User is authorized');
        const contentType = req.get('Accept') || 'text/plain';
        logger.info(`User is authorised`);
        const specialURL = req.body.custom;
        if (specialURL) {
            const customUrlExists = await db.hgetall(`short:${specialURL}`);
            if (Object.keys(customUrlExists).length) {
                return res.status(409).json({
                    status: 409,
                    message: `URL with name ${specialURL} already exists. try different URL`
                });
            }
        }
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
            if (req.body.expires) {
                const duration = getExpiry(req.body.expires);
                await db.expire(`short:${customOrAuto}`, duration);
                await db.hset(`short:${customOrAuto}`, 'expires', duration);
            }
            if (contentType === 'application/json') {
                res.json({
                    message: fullURL,
                    status: 200
                });
            } else {
                res.end(`${fullURL}\n`);
            }
        } else {
            logger.error('User has given invalid URL ' + URL);
            res.status(400).json({
                status: 400,
                message: 'Bad Request, URL in invalid'
            });
        }
    } else {
        logger.error('Unauthorized user visit ' + JSON.stringify(req.ip));
        res.status(responseStatus).end('incorrect or missing API key');
    }
};

module.exports = urlShortener;
