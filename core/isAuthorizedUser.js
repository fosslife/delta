'use strict';

const auth = require('./auth');

const isAuthorizedUser = currentKey => {
    if (!currentKey) {
        return 403;
    } else if (!auth(currentKey)) {
        return 401;
    } else {
        return 200;
    }
};

module.exports = isAuthorizedUser;
