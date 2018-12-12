'use strict';

const app = require('express')();
const path = require('path');
const fs = require('fs');
const { upload } = require('./diskstorage');
const { CronJob } = require('cron');
const { differenceInDays } = require('date-fns');
// CONSTANTS:
const MIN_AGE = 1; // DAYS
const MAX_AGE = 30; // DAYS
const MAX_SIZE = 2000; // 2MB

/**
 * Cron job runs every At 04:05 on Sunday. (randon yes)
 */
const job = new CronJob('5 4 * * sun', () => {
    const uploadsDir = path.resolve(__dirname, 'uploads');
    let unsorted = [];
    const files = fs.readdirSync(uploadsDir);
    files.forEach(function (file, index) {
        const stat = fs.statSync(path.join(uploadsDir, file));
        const retention = MIN_AGE + (-MAX_AGE + MIN_AGE) * Math.pow((parseInt(stat.size / 1000.0) / MAX_SIZE - 1), 3);
        // console.log('retention for', file, 'is', retention);
        unsorted.push({ file, size: parseInt(stat.size / 1000.0), date: stat.mtime, retention: parseInt(retention) }); // convert size to KB. use 1000000 for MB.
    });
    // console.log(sorted);
    unsorted.forEach((file) => {
        const diff = differenceInDays(new Date(), file.date);
        console.log(diff, file.retention);
        if (diff > file.retention) {
            // console.log('deleting', file);
            fs.unlink(path.resolve(uploadsDir, file.file), (err) => {
                if (err) {
                    console.log('Error while deleting', err);
                }
                console.log('Successsfully deleted the file', file.file);
            });
        }
    });
}, null, false, 'Asia/Kolkata');

job.start();

app.post('/upload', (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            res.json({ key: 'Something went wrong', err });
        }
        // console.log("Req", req.file);
        const url = req.file.url;
        res.json({ url: 'http://localhost:3000/' + url });
    });
});

app.get('/favicon.ico', (req, res) => res.sendFile(path.resolve(__dirname, 'favicon.ico')));

app.get('/:file', (req, res, next) => {
    const originalFile = req.params.file;

    const files = fs.readdirSync(path.resolve(__dirname, 'uploads'));

    for (let file of files) {
        const splitted = file.split('.')[0];
        if (splitted === originalFile) {
            res.sendFile(path.resolve(__dirname, 'uploads', file), err => {
                if (err) {
                    next(err);
                } else {
                    console.log('File sent', file);
                }
            });
        }
    }
});

app.listen(3000, () => console.log('http://localhost:3000/'));
