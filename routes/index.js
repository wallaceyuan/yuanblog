var express = require('express');
var markdown = require('markdown').markdown;
var modelCollect = require('../model/user');
var router = express.Router();
router.use(function(req,res,next){
    next();
});

/* GET home page. */
/*router.get('/', function(req, res, next) {
    modelCollect.articleModel.find({}).populate('user').exec(function(err,articles){
        articles.forEach(function (article) {
            article.content = markdown.toHTML(article.content);
        });
        res.render('index', {title: '主页',articles:articles});
    });
});*/
router.get('/', function(req, res, next) {
    res.redirect('/articles/list/1/2');
});
module.exports = router;
