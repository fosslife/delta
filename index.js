'use strict';

const app = require('express')();
const path = require('path');
const fs = require('fs');
const { upload } = require('./diskstorage');

// CONSTANTS:
const MIN_AGE = 1; // DAYS
const MAX_AGE = 30; // DAYS
const MAX_SIZE = 2000; // 2MB

console.log('\n'.repeat(25));

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

app.get('/del', (req, res) => {
    const uploadsDir = path.resolve(__dirname, 'uploads');
    let unsorted = [];
    const files = fs.readdirSync(uploadsDir);
    files.forEach(function (file, index) {
        const stat = fs.statSync(path.join(uploadsDir, file));
        const retention = MIN_AGE + (-MAX_AGE + MIN_AGE) * Math.pow((parseInt(stat.size / 1000.0) / MAX_SIZE - 1), 3);
        console.log('retension for', file, 'is', retention);
        unsorted.push({ file, size: parseInt(stat.size / 1000.0), date: stat.ctime, retention: parseInt(retention) }); // convert size to KB. use 1000000 for MB.
    });
    const sorted = sort(unsorted);
    console.log(sorted);
    res.end(sorted.toString());

});

function sort (arr) {
    return [...arr].sort((a, b) => a.retention > b.retention ? 1 : b.retention > a.retention ? -1 : 0);
}

app.get('*', (req, res, next) => {
    const originalFile = req.originalUrl.split('/')[1];

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
