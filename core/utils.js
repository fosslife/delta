'use strict';
const { users } = require('../config');

function getExpiry(str) {
    const timeFactor = str.substring(str.length - 1);
    const time = str.substring(0, str.length - 1);

    const multipliers = {
        s: t => t,
        m: t => t * 60,
        h: t => t * 3600,
        d: t => t * 86400,
        w: t => t * 1.6534e-6,
        M: t => t * 2.628e6
    };
    return multipliers[timeFactor](time);
}

function auth(apikey) {
    return users.find(e => e[1] === apikey);
}

function isAuthorizedUser(currentKey) {
    if (!currentKey) {
        return 403;
    } else if (!auth(currentKey)) {
        return 401;
    } else {
        return 200;
    }
}

module.exports = {
    getExpiry,
    isAuthorizedUser,
    auth
};
