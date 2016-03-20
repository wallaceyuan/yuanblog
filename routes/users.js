var express = require('express');
var userModel = require('../model/user');
var middleware = require('../middleware/index');
var router = express.Router();

/* GET users listing. */
router.get('/reg',middleware.checkNotLogin,function(req,res){
    res.render('user/reg');
});
//提交用户注册的表单
router.post('/reg',middleware.checkNotLogin,function(req,res){
    var user = req.body;
    userModel.create(user,function(err,doc){
        if(err){
            req.flash('error', '登录失败!');
            res.redirect('back');//返回到上一个页面
        }else{
            req.flash('success', '登录成功!');
            req.session.user = doc;
            res.redirect('/');
        }
    });
});

//用户登录 当用户通过get方法请求 /users/reg的时候，执行此回调
router.get('/login',middleware.checkNotLogin,function(req,res){
    res.render('user/login');
});

//提交用户登录的表单
router.post('/login',middleware.checkNotLogin,function(req,res){
    res.send('login');
});

//退出登录
router.get('/logout',middleware.checkLogin,function(req,res){
    req.session.user  = null;
    res.send('logout');
});

module.exports = router;
