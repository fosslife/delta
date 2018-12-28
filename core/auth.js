'use strict';

const { users } = require('../config');

const auth = apikey => users.find(e => e[1] === apikey);

module.exports = auth;
