/**
 * Created by Yuan on 2016/3/20.
 */
// 引入此模块
var mongoose = require('mongoose');

mongoose.connect('mongodb://123.57.143.189:27017/yuanblog');
//定义模型 确定数据库里表结构
var userSchema = new mongoose.Schema({
    username:String,
    password:String,
    email:String,
    avatar:String
});
//再定义model
var userModel = mongoose.model('user',userSchema);

var articleSchema = new mongoose.Schema({
    user:{type: String,ref:'user'},
    title: String,
    content:String,
    img:String,
    createAt:{type: Date, default: Date.now},
    comments: [{user:{type:String,ref:'user'},content:String,createAt:{type: Date, default: Date.now}}],
    pv: {type:Number,default:0}
});

//再定义model
var articleModel = mongoose.model('article',articleSchema);


var modelCollect = {
    userModel:userModel,
    articleModel:articleModel
}

module.exports = modelCollect;