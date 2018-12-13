'use strict';
/**
 * Imports
 */
const app = require('express')();
const path = require('path');
const fs = require('fs');
const { upload } = require('./diskstorage');
const { CronJob } = require('cron');
const { differenceInDays } = require('date-fns');
const { auth: { API_KEY } } = require('./config');
/**
 * Constants
 */
const MIN_AGE = 1; // DAYS
const MAX_AGE = 30; // DAYS
const MAX_SIZE = 2000; // 2MB
const DOMAIN = 'http://localhost:3000/'; // Mind the training slash (/)

/**
 * Cron job runs every At 04:05 on Sunday. (random, yes)
 */
const job = new CronJob('5 4 * * sun', () => {
    const uploadsDir = path.resolve(__dirname, 'uploads');
    let filesMetadata = [];
    const files = fs.readdirSync(uploadsDir);
    files.forEach(function (file, index) {
        const stat = fs.statSync(path.join(uploadsDir, file));
        const retention = MIN_AGE + (-MAX_AGE + MIN_AGE) * Math.pow((parseInt(stat.size / 1000.0) / MAX_SIZE - 1), 3);
        filesMetadata.push({
            file,
            size: parseInt(stat.size / 1000.0),
            date: stat.mtime,
            retention: parseInt(retention),
        }); // convert size to KB. use 1000000 for MB.
    });
    filesMetadata.forEach((file) => {
        const diff = differenceInDays(new Date(), file.date);
        if (diff > file.retention) {
            fs.unlink(path.resolve(uploadsDir, file.file), (err) => {
                if (err) {
                    console.error('Error while deleting', err);
                }
                console.log('Successsfully deleted the file', file.file);
            });
        }
    });
}, null, false, 'Asia/Kolkata'); // Also exposes .start() chained method

job.start();
/**
 * POST method to upload file
 */
app.post('/', (req, res) => {
    const API_KEY_HEADER = req.get('x-api-key');
    if (!API_KEY_HEADER) {
        res.sendStatus(401);
        res.end();
    } else if (API_KEY_HEADER !== API_KEY) {
        res.sendStatus(403);
        res.end();
    } else {
        upload(req, res, function (err) {
            if (err) {
                res.json({ key: 'Something went wrong', err });
            }
            const url = `${DOMAIN}${req.file.url}`;
            res.end(url);
        });
    }
});

app.get('/favicon.ico', (req, res) => res.sendFile(path.resolve(__dirname, 'favicon.ico')));

app.get('/:file', (req, res, next) => {
    const API_KEY_HEADER = req.get('x-api-key');
    if (!API_KEY_HEADER) {
        res.sendStatus(401);
        res.end();
    } else if (API_KEY_HEADER !== API_KEY) {
        res.sendStatus(403);
        res.end();
    } else {
        const requestedFile = req.params.file;
        fs.readFile(path.resolve(__dirname, 'uploads', requestedFile), readErr => {
            if (readErr) {
                console.error('File reading Error', readErr);
                res.end('File not found');
            }
            res.sendFile(path.resolve(__dirname, 'uploads', requestedFile), err => {
                if (err) {
                    console.error('Error while sending the file', err);
                    res.end('Cannot send the specified file');
                }
            });
        });
    }
});

app.listen(3000, () => console.log(`Server started at ${DOMAIN}`));
