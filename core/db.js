'use strict';
const Redis = require('ioredis');
const { dbconfig } = require('../config');
const db = new Redis(dbconfig);
const manager = new Redis(dbconfig);
const nanoid = require('nanoid/generate');

manager.subscribe('removed');

manager.on('message', async function() {
    const count = await db.scard('genurls');
    if (count < 100) {
        generateUrls(5000);
    }
});

db.on('connect', async function() {
    const prevUrlsCount = await db.scard('genurls');
    if (prevUrlsCount < 100) {
        generateUrls(10000);
    }
});

if (process.env.NODE_ENV === 'development') {
    (async () => {
        const monitor = await db.monitor();
        monitor.on('monitor', console.log);
    })();
}
function generateUrls(n) {
    let length = 4;
    for (let i = 0; i < n; i++) {
        if (i === n / 2) {
            length += 1;
        }
        const id = nanoid(
            '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-',
            length
        );
        db.sadd('genurls', id);
    }
}
module.exports = db;
