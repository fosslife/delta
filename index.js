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
const { promisify } = require('util');
/**
 * Constants
 */
const MIN_AGE = 1; // DAYS
const MAX_AGE = 30; // DAYS
const MAX_SIZE = 2000; // 2MB
const DOMAIN = 'http://localhost:3000/'; // Mind the training slash (/)

const readFileAsync = promisify(fs.readFile);
const readDirAsync = promisify(fs.readdir);
const deleteAsync = promisify(fs.unlink);

function getRetentionPeriod(stat) {
    return MIN_AGE + (-MAX_AGE + MIN_AGE) * Math.pow((parseInt(stat.size / 1000.0) / MAX_SIZE - 1), 3);
}

function uploadsPath(childPath = '') {
    return path.resolve(__dirname, 'uploads', childPath);
}

function getFileStats(file) {
    const stat = fs.statSync(path.join(uploadsPath(), file));
    const retention = getRetentionPeriod(stat);
    return {
        file,
        size: parseInt(stat.size / 1000.0),
        date: stat.mtime,
        retention: parseInt(retention),
    };
}

function isAuthorizedUser(currentKey) {
    if (!currentKey) {
        return 401;
    } else if (currentKey !== API_KEY) {
        return 403;
    } else {
        return 200;
    }
}
/**
 * Cron job runs every At 04:05 on Sunday. (random, yes)
 */
const job = new CronJob('5 4 * * sun', () => {
    readDirAsync(uploadsPath())
        .then(files => {
            files.map(file => {
                return getFileStats(file);
            }).map(file => {
                const diff = differenceInDays(new Date(), file.date);
                if (diff > file.retention) {
                    deleteAsync(uploadsPath(file.file))
                        .then(() => {
                            console.log('Successsfully deleted the file', file.file);
                        }).catch(err => {
                            console.error('Error while deleting', err);
                        });
                }
            });
        })
        .catch(err => {
            console.error('Error in directory reading', err);
        });
}, null, false, 'Asia/Kolkata'); // Also exposes .start() chained method

job.start();
/**
 * POST method to upload file
 */
app.post('/', (req, res) => {
    const API_KEY_HEADER = req.get('x-api-key');
    const responseStatus = isAuthorizedUser(API_KEY_HEADER);
    if (responseStatus === 200) {
        upload(req, res, function (err) {
            if (err) {
                res.json({ key: 'Something went wrong', err });
            }
            const url = `${DOMAIN}${req.file.url}`;
            res.end(url);
        });
    } else {
        res.sendStatus(responseStatus).end();
    }
});

app.get('/favicon.ico', (req, res) => res.sendFile(uploadsPath('favicon.ico')));

app.get('/:file', (req, res, next) => {
    const API_KEY_HEADER = req.get('x-api-key');
    const responseStatus = isAuthorizedUser(API_KEY_HEADER);
    if (responseStatus === 200) {
        const requestedFile = req.params.file;
        readFileAsync(uploadsPath(requestedFile))
            .then(() => {
                res.sendFile(uploadsPath(requestedFile), err => {
                    if (err) {
                        console.error('Error while sending the file', err);
                        res.end('Cannot send the specified file');
                    }
                });
            })
            .catch(readErr => {
                console.error('File reading Error', readErr);
                res.end('File not found');
            });
    } else {
        res.sendStatus(responseStatus).end();
    }
});

app.listen(3000, () => console.log(`Server started at ${DOMAIN}`));
