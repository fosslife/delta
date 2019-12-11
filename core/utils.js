'use strict';

function getExpiry(str) {
    const timeFactor = str.substring(str.length - 1);
    const time = str.substring(0, str.length - 1);

    const multipliers = {
        s: t => t,
        m: t => t * 60,
        h: t => t * 3600,
        d: t => t * 86400,
        M: t => t * 2.628e6
    };
    return multipliers[timeFactor](time);
}

module.exports = {
    getExpiry
};
