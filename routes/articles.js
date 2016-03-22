var express = require('express');
//生成一个路由实例
var router = express.Router();
var modelCollect = require('../model/user');
var middleware = require('../middleware/index');
var path = require('path');
var multer = require('multer');
var markdown = require('markdown').markdown;
var async = require('async');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+'.'+file.mimetype.slice(file.mimetype.indexOf('/')+1))
    }
});
var upload = multer({ storage:storage});

//请求一个空白发表文章页面
router.get('/add',middleware.checkLogin,function(req,res){
    res.render('article/add',{title:'添加文章',article:{}});
});
//提交文章数据
router.post('/add',upload.single('img'),middleware.checkLogin,function(req,res){
    if(req.file){
        req.body.img = path.join('/uploads',req.file.filename);
    }
    var _id = req.body._id;
    if(_id){
        var set = {title:req.body.title,content:req.body.content}
        if(req.file){
            set.img = req.body.img;
        }
        modelCollect.articleModel.update({_id:req.body._id},{$set:set},function(err,result){
            if(err){
                req.flash('error','更新文章失败');
                return res.redirect('back');//返回到上一个页面
            }
            req.flash('success', '更新文章成功!');
            res.redirect('/');//注册成功后返回主页
        });
    }else{
        req.body.user = req.session.user._id;
        delete req.body._id;
        var article = req.body;
        console.log(article);
        modelCollect.articleModel.create(article,function(err,doc){
            if(err){
                req.flash('error', '添加文章失败!');
                res.redirect('back');//返回到上一个页面
            }else{
                req.flash('success', '添加文章成功!');
                res.redirect('/');
            }
        });
    }

});

//删除
router.get('/delete/:_id',function (req,res) {
    modelCollect.articleModel.remove({_id:req.params._id},function(err,docs){
        if(err){
            req.flash('error', '删除文章失败!');
            return res.redirect('back');//返回到上一个页面
        }
        req.flash('success', '删除文章成功!');
        res.redirect('/');
    });
});

//详情
router.get('/detail/:_id',function(req,res){
    async.parallel([
        function(callback){
            modelCollect.articleModel.findOne({_id:req.params._id}).populate('user').populate('comments.user').exec(function(err,article){
                if(article.comments == undefined){
                    article.comments =  [];
                }
                article.content = markdown.toHTML(article.content);
                callback(err,article);
            });
        },function(callback){
            modelCollect.articleModel.update({_id:req.params._id},{$inc:{pv:1}},callback);
        }
    ],function(err,result){
        if(err){
            req.flash('error',err);
            res.redirect('back');
        }
        res.render('article/detail',{title:'查看文章',article:result[0]});
    })

});

//修改
router.get('/edit/:_id',function(req,res){
    modelCollect.articleModel.findOne({_id:req.params._id},function(err,article){
        article.content = markdown.toHTML(article.content);
        res.render('article/add',{title:'编辑文章',article:article});
    });
});

//分页
router.get('/list/:pageNum/:pageSize',function(req,res,next){
    var pageNum = req.params.pageNum && req.params.pageNum>0?parseInt(req.params.pageNum):1;
    var pageSize =req.params.pageSize&&req.params.pageSize>0?parseInt(req.params.pageSize):2;
    var keyword = req.query.keyword;
    var searchBtn = req.query.searchBtn;
    var query = {};
    if(searchBtn){
        req.session.keyword = keyword;
    }
    if(req.session.keyword){
        query['title'] = new RegExp(req.session.keyword,"i");
    }
    modelCollect.articleModel.count(query,function(err,count){
        modelCollect.articleModel.find(query).sort({createAt:-1}).limit(pageSize).skip((pageNum-1)*pageSize).populate('user').exec(function(err,articles){
            articles.forEach(function (article) {
                article.content = markdown.toHTML(article.content);
            });
            res.render('index',{
                title:'主页',
                pageNum:pageNum,
                pageSize:pageSize,
                keyword:req.session.keyword,
                totalPage:Math.ceil(count/pageSize),
                articles:articles
            });
        });
    });
});

//评论
router.post('/comment',middleware.checkLogin, function (req, res) {
    var user = req.session.user;
    modelCollect.articleModel.update({_id:req.body._id},{$push:{comments:{user:user._id,content:req.body.content}}},function(err,result){
        if(err){
            req.flash('error',err);
            return res.redirect('back');
        }
        req.flash('success', '评论成功!');
        res.redirect('back');
    });
});



module.exports = router;
