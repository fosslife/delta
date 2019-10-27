'use strict';
const Redis = require('ioredis');
const db = new Redis();

(async () => {
    const monitor = await db.monitor();
    monitor.on('monitor', console.log);
})();

module.exports = db;
