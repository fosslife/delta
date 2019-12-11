'use strict';

module.exports = {
    timeZone: 'Asia/Kolkata',
    users: [
        ['Spark', 'spark1234', 'https://i.spark.pepe/'],
        ['John', '1234John', 'https://john.meme/']
    ],
    uploadpath: `${__dirname}/uploads`,
    cron: {
        schedule: '0 0 1 * *', // 1st Day of every month at 00:00
        min_age: 1, // Minimum days to keep file
        max_age: 30, // Maximym days to keep file
        max_size: 2000 // Size in KB to calculate retenstion period against
    },
    dbconfig: {
        port: 6379, // Redis port
        host: '127.0.0.1', // Redis host
        password: '' // Redis password, keep blank for default
    }
};
