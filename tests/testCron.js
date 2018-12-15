const fs = require('fs');
const { promisify } = require('util');
const readDirAsync = promisify(fs.readdir);
const path = require('path');
const { differenceInDays } = require('date-fns');
const deleteAsync = promisify(fs.unlink);

const MIN_AGE = 1; // DAYS
const MAX_AGE = 30; // DAYS
const MAX_SIZE = 2000; // 2MB

function uploadsPath(childPath = '') {
    return path.resolve(__dirname, '../testUploads', childPath);
}

function getRetentionPeriod(stat) {
    return MIN_AGE + (-MAX_AGE + MIN_AGE) * Math.pow((parseInt(stat.size / 1000.0) / MAX_SIZE - 1), 3);
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

readDirAsync(uploadsPath())
    .then(files => {
        files.map(file => {
            return getFileStats(file);
        }).map(file => {
            const diff = differenceInDays(new Date(), file.date);
            if (diff > file.retention) {
                // console.log('File will be deleted', file.file, 'retension', file.retention);
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
