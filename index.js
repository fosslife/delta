const app = require('express')();
const path = require('path');
const multer = require('multer');
const shortid = require('shortid');

var storage = multer.diskStorage({
    destination: 'uploads',
    filename: function(req, file, cb){
        const id = shortid.generate();
        file.url = id;
        cb(null, id + path.extname(file.originalname))
    }
})

const upload = multer({
    storage
}).single('file');

app.post('/upload', (req, res)=>{
    upload(req, res, function(err){
        if(err){
            res.json({key: 'Something went wrong', err });
        }
        const url = req.file.url;
        console.log("Req", url);
        res.json({url:'http://i.sprk.pw/'+ url});
    });
});


app.listen(3000, () => console.log('http://localhost:3000/'));