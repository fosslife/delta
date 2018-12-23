'use strict';

const { promisify } = require('util');
const fs = require('fs');
const readDirAsync = promisify(fs.readdir);
const { CronJob } = require('cron');
const { differenceInDays } = require('date-fns');
const path = require('path');
const deleteAsync = promisify(fs.unlink);
const logger = require('./logger');
const { timeZone } = require('../config');
const db = require('./db');

const MIN_AGE = 1; // DAYS
const MAX_AGE = 30; // DAYS
const MAX_SIZE = 2000; // 2MB

const uploadsPath = (childPath = '') => {
    return path.resolve(__dirname, '../uploads', childPath);
};

const getFileStats = file => {
    const stat = fs.statSync(path.join(uploadsPath(), file));
    const retention = getRetentionPeriod(stat);
    return {
        file,
        size: parseInt(stat.size / 1000.0),
        date: stat.mtime,
        retention: parseInt(retention),
    };
};

const getRetentionPeriod = stat => {
    return MIN_AGE + (-MAX_AGE + MIN_AGE) * Math.pow((parseInt(stat.size / 1000.0) / MAX_SIZE - 1), 3);
};

const job = new CronJob('5 4 * * sun', () => {
    logger.info('Running Cron job for deleting files');
    readDirAsync(uploadsPath())
        .then(files => {
            files.map(file => {
                return getFileStats(file);
            }).map(file => {
                const diff = differenceInDays(new Date(), file.date);
                if (diff > file.retention) {
                    deleteAsync(uploadsPath(file.file))
                        .then(() => {
                            db.get('files')
                                .remove({ 'shortened': file.file })
                                .write();
                            logger.info('Successsfully deleted the file ' + file.file);
                        }).catch(err => {
                            logger.error('Error while deleting' + err);
                        });
                }
            });
        })
        .catch(err => {
            logger.error('Error in directory reading' + err);
        });
}, null, false, timeZone); // Also exposes .start() chained method

module.exports = job;
