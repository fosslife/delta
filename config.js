'use strict';

module.exports = {
    timeZone: 'Asia/Kolkata',
    users: [
        ['spark', 's', 'https://i.sprk.pw/'],
        ['pwnj', 'p', 'https://pwnj.pw/']
    ],
    uploadpath: `${__dirname}/uploads`,
    cron: {
        schedule: '0 0 1 * *',
        min_age: 1, // Minimum days to keep file
        max_age: 30, // Maximym days to keep file
        max_size: 2000 // Size in KB to calculate retenstion period against
    }
};
