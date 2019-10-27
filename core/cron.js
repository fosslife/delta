'use strict';

const { promisify } = require('util');
const fs = require('fs');
const readDirAsync = promisify(fs.readdir);
const { CronJob } = require('cron');
const { differenceInDays } = require('date-fns');
const path = require('path');
const deleteAsync = promisify(fs.unlink);
const logger = require('./logger');
const { timeZone, cron } = require('../config');
const db = require('./db');

const MIN_AGE = cron.min_age; // DAYS
const MAX_AGE = cron.max_age; // DAYS
const MAX_SIZE = cron.max_size * 1024 * 1024; // 2MB

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
        retention: parseInt(retention)
    };
};

const getRetentionPeriod = stat => {
    return (
        MIN_AGE +
        (-MAX_AGE + MIN_AGE) *
            Math.pow(parseInt(stat.size / 1000.0) / MAX_SIZE - 1, 3)
    );
};

const job = new CronJob(
    cron.schedule,
    async () => {
        logger.info('Running Cron job for deleting files');
        const files = await readDirAsync(uploadsPath());
        for (const file of files) {
            const fileStats = getFileStats(file);
            const diff = differenceInDays(new Date(), fileStats.date);
            if (diff > fileStats.retention) {
                await deleteAsync(uploadsPath(fileStats.file));
                await db.sadd(`deleted`, fileStats.file);
                await db.srem('urls', fileStats.file.split('.')[0]);
                logger.info('Successsfully deleted the file ' + fileStats.file);
            }
        }
    },
    null,
    false,
    timeZone
); // Also exposes .start() chained method

module.exports = job;
