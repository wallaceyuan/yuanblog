var express = require('express');
var path = require('path');
//处理收藏夹图标的
var favicon = require('serve-favicon');
//写日志的
var logger = require('morgan');
//解释cookier的  req.cookie方法用来设置cookie req.cookies  把请求中 的cookie封装成对象
var cookieParser = require('cookie-parser');
//解析请求体的 req.body
var bodyParser = require('body-parser');
//加载路由 根据请求的路径不同，进行不同的处理
var routes = require('./routes/index');
var users = require('./routes/users');
var articles = require('./routes/articles');
var session = require('express-session');
var MongoStore = require('connect-mongo/es5')(session);
var flash = require('connect-flash');
var fs = require('fs');
var app = express();

//设置模板文件的存放路径
app.set('views', path.join(__dirname, 'views'));
// 设置模板引擎
app.set('view engine', 'html');
//设置一下对于html格式的文件，渲染的时候委托ejs的渲染方面来进行渲染
app.engine('html', require('ejs').renderFile);
//使用了会话中间件之后，req.session
var mongoose = require('mongoose');
connection = mongoose.createConnection('mongodb://123.57.143.189:27017/yuanblog');
app.use(session({
    secret: 'yuanblog',
    resave: false,
    saveUninitialized: true,
    //指定保存的位置
    store: new MongoStore({mongooseConnection:connection})
}));
app.use(flash());
app.use(function(req,res,next){
    res.locals.user = req.session.user;
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    next();
});
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

var accessLog = fs.createWriteStream('access.log', {flags: 'a'});
app.use(logger('dev',{stream: accessLog}));

var errorLog = fs.createWriteStream('error.log', {flags: 'a'});
app.use(function (err, req, res, next) {
    var meta = '[' + new Date() + '] ' + req.url + '\n';
    errorLog.write(meta + err.stack + '\n');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req,res,next){
    //res.locals才是真正的渲染模板的对象
    res.locals.user = req.session.user;
    next();
});
app.use('/', routes);
app.use('/users', users);
app.use('/articles', articles);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.render("404");
  //next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
