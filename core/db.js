'use strict';
const Redis = require('ioredis');
const db = new Redis();
const manager = new Redis();
const nanoid = require('nanoid/generate');

manager.subscribe('removed');

manager.on('message', async function(channel, message) {
    const count = await db.scard('genurls');
    if (count < 5) {
        console.log('db has', count, 'urls, generating more urls');
        generateUrls(5);
    }
    console.log('Got', message, 'from channel', channel);
});

db.on('connect', function() {
    console.log('Connected to redis instance');
    generateUrls(10);
});

if (process.env.NODE_ENV === 'developments') {
    (async () => {
        const monitor = await db.monitor();
        monitor.on('monitor', console.log);
    })();
}
function generateUrls(n) {
    let length = 4;
    for (let i = 0; i < n; i++) {
        if (i === 5000) {
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
