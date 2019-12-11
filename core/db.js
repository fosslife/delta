'use strict';
const Redis = require('ioredis');
const { dbconfig, urlLength, urlString } = require('../config');
const db = new Redis(dbconfig);
const manager = new Redis(dbconfig);
const nanoid = require('nanoid/generate');

manager.subscribe('removed');

manager.on('message', async function() {
    const count = await db.scard('genurls');
    if (count < 100) {
        // On every message, generate new 5000 urls if
        // count if existing is less than 100
        generateUrls(5000);
    }
});

db.on('connect', async function() {
    const prevUrlsCount = await db.scard('genurls');
    if (prevUrlsCount < 100) {
        // on connect (start), if previous urls count is less than 100
        // generate 10000 more
        generateUrls(10000);
    }
});

// get DB logs in dev mode
if (process.env.NODE_ENV === 'development') {
    (async () => {
        const monitor = await db.monitor();
        monitor.on('monitor', console.log);
    })();
}

function generateUrls(urlsToGenerate) {
    const length = urlLength;
    for (let i = 0; i < urlsToGenerate; i++) {
        const id = nanoid(urlString, length);
        db.sadd('genurls', id);
    }
}
module.exports = db;
