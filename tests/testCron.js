/* eslint-disable */
'use strict';

const lorem = require('lorem-ipsum');
const fs = require('fs');
const { promisify } = require('util');
const path = require('path');

const readDirAsync = promisify(fs.readdir);
const exec = promisify(require('child_process').exec);
const apendFile = promisify(require('fs').appendFile);
const { format, differenceInDays } = require('date-fns');
const deleteAsync = promisify(fs.unlink);

const MIN_AGE = 1; // DAYS
const MAX_AGE = 30; // DAYS
const MAX_SIZE = 1000 * 1024 * 1024; // 1MB

function uploadsPath(childPath = '') {
    return path.resolve(__dirname, '../testUploads', childPath);
}

function generateRandomDate(start, end) {
    return new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
}

function getRetentionPeriod(stat) {
    return (
        MIN_AGE +
        (-MAX_AGE + MIN_AGE) *
            Math.pow(parseInt(stat.size / 1000.0) / MAX_SIZE - 1, 3)
    );
}

function getFileStats(file) {
    const stat = fs.statSync(path.join(uploadsPath(), file));
    const retention = getRetentionPeriod(stat);
    return {
        file,
        size: parseInt(stat.size / 1000.0),
        date: stat.mtime,
        retention: parseInt(retention)
    };
}
const execCommands = [];

async function main() {
    // Create test uploads folder
    if (!fs.existsSync('testUploads')) {
        fs.mkdirSync('testUploads');
    }
    // create 30 random upload files
    for (let i = 0; i < 30; i++) {
        const id = Math.random()
            .toString(26)
            .substring(7);
        const filename = id + '.txt';
        const randomDate = format(
            generateRandomDate(
                new Date('27 Sept 2019'),
                new Date('26 Oct 2019')
            ),
            'YYYYMMDDhhmm'
        );
        // Modify their file attributes with random 'past' date
        await exec('touch -a -m -t ' + randomDate + ' testUploads/' + filename);
        // fill them with random data
        const lor = lorem({
            count: Math.floor(Math.random() * 5000),
            units: 'paragraphs'
        });
        await apendFile('testUploads/' + filename, lor);
        const execString = `touch -a -m -t ${randomDate} testUploads/${filename}`;

        execCommands.push(execString);
    }

    // execute the modification command
    for (const i of execCommands) {
        await exec(i);
    }

    const files = await readDirAsync(uploadsPath());
    for (const file of files) {
        const fileStats = getFileStats(file);
        const diff = differenceInDays(new Date(), fileStats.date);
        if (diff > fileStats.retention) {
            await deleteAsync(uploadsPath(fileStats.file));
            console.log(
                `Deleting ${fileStats.file} as ${diff} > ${
                    fileStats.retention
                } created at ${format(fileStats.date, 'DD MMM YYYY')} Size: ${
                    fileStats.size
                }`
            );
        }
    }

    // Delete generated test files
    // fs.rmdirSync("testUploads");   => node can't delete folder that's not empty?
    exec('rm -rf testUploads/');
}

main();
