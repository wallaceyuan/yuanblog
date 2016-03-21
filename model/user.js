/**
 * Created by Yuan on 2016/3/20.
 */
// 引入此模块
var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/yuanblog');
//定义模型 确定数据库里表结构
var userSchema = new mongoose.Schema({
    username:String,
    password:String,
    email:String,
    avatar:String
});
//再定义model
var userModel = mongoose.model('user',userSchema);

module.exports = userModel;