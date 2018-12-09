const app = require('express')();
const path = require('path');
const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');


const storage = multer.diskStorage({
    destination: 'uploads',
    filename: function (req, file, cb) {
        const id = shortid.generate();
        file.url = id;
        cb(null, id + path.extname(file.originalname))
    }
})

const upload = multer({
    storage
}).single('file');

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

app.get('*', (req, res, next) => {
    const originalFile = req.originalUrl.split('/')[1];

    const files = fs.readdirSync(__dirname + "/uploads");

    for (file of files) {
        const splitted = file.split('.')[0];
        if (splitted === originalFile) {
            res.sendFile(path.resolve(__dirname, 'uploads', file), (err) => {
                if (err) {
                    next(err);
                } else {
                    console.log("File sent", file);
                }
            });
        } 
    }
});


app.listen(3000, () => console.log('http://localhost:3000/'));