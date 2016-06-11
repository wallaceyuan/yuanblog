var express = require('express');
var formidable = require('formidable');
var router = express.Router();

router.use(function(req,res,next){
    next();
});


router.get('/', function(req, res, next) {
    res.render('upload/index',{title:'上传文件'});
});

router.post('/post',function(req,res,next){
    var parser = new formidable.IncomingForm();
    parser.parse(req,function(err,fields,files) {
        console.log(fields,files);
        res.end('hello');
    });
})
module.exports = router;
