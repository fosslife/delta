'use strict';

const { auth: { API_KEY } } = require('../config');

const isAuthorizedUser = currentKey => {
    if (!currentKey) {
        return 403;
    } else if (currentKey !== API_KEY) {
        return 401;
    } else {
        return 200;
    }
};

module.exports = isAuthorizedUser;
