var express = require('express');
var userModel = require('../model/user');
var middleware = require('../middleware/index');
var crypto = require('crypto');
var router = express.Router();

/* GET users listing. */
router.get('/reg',middleware.checkNotLogin,function(req,res){
    res.render('user/reg');
});
//提交用户注册的表单
router.post('/reg',middleware.checkNotLogin,function(req,res){
    var user = req.body;
    if(user.password != user.repassword){
        req.flash('error','两次输入的密码不一致');
        return res.redirect('/users/reg');
    }
    delete user.repassword;
    user.password = md5(user.password);
    user.avatar = "https://secure.gravatar.com/avatar/"+md5(user.email)+"?s=48";
    userModel.create(user,function(err,doc){
        if(err){
            req.flash('error', '注册失败!');
            res.redirect('back');//返回到上一个页面
        }else{
            req.flash('success', '注册成功!');
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
    var user = req.body;
    user.password = md5(user.password);
    userModel.findOne(user,function(err,doc){
        console.log(doc);
        if(err ||doc == null){
            req.flash('error', '登录失败!');
            res.redirect('/users/login');
        }else{
            req.flash('success', '登录成功!');
            req.session.user = user;//用户信息存入 session
            res.redirect('/');//注册成功后返回主页
        }
    });
});

//退出登录
router.get('/logout',middleware.checkLogin,function(req,res){
    req.session.user  = null;
    res.redirect('/');//注册成功后返回主页
});
function md5(val){
    return crypto.createHash('md5').update(val).digest('hex');
}
module.exports = router;
