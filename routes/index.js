var express = require('express');
var router = express.Router();
router.use(function(req,res,next){
    next();
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
