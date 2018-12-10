'use strict';

const app = require('express')();
const path = require('path');
const fs = require('fs');
const { upload } = require('./diskstorage');

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
        unsorted.push({ file, size: stat.size, date: stat.ctime });
    });
    console.log('Original\n', unsorted, '\n\n');
    const sorted = sort(unsorted);
    console.log(sorted);
});

function sort (arr) {
    return [...arr].sort((a, b) => a.size - b.size);
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
