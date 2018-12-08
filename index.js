var express = require('express');
var router = express();

var multer = require("multer");
var upload = multer({ dest: 'uploads' })

router.post('/restapi', upload.single('file'), function (req, res, next) {
    if (!req.file) {
        res.json({ "error": "not working" });
        return;
    }
    console.log(req.file);
    const filename = req.file.filename.substring(0, 5);
    console.log("Saving as..", filename);
    
    res.json({ "url": filename });
    return;
});

router.listen(3000, () => console.log('http://localhost:3000/'))