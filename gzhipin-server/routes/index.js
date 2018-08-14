var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// 引入md5加密函数库
const md5 = require('blueimp-md5')
// 引入UserModel
const UserModel = require('../db/models').UserModel
const filter = {password: 0} // 查询时过滤出指定的属性

// 注册路由
router.post('/register', function (req, res) {
    // 1. 获取请求参数数据(username, password, type)
    const {username, password, type} = req.body
    // 2. 处理数据
    // 3. 返回响应数据
    // 2.1. 根据username查询数据库, 看是否已存在user
    UserModel.findOne({username}, function (err, user) {
        // 3.1. 如果存在, 返回一个提示响应数据: 此用户已存在
        if(user) {
            res.send({code: 1, msg: '此用户已存在'}) // code是数据是否是正常数据的标识
        } else {
            // 2.2. 如果不存在, 将提交的user保存到数据库
            new UserModel({username, password: md5(password), type}).save(function (err, user) {
                // 生成一个cookie(userid: user._id), 并交给浏览器保存
                res.cookie('userid', user._id, {maxAge: 1000*60*60*24*7}) // 持久化cookie, 浏览器会保存在本地文件
                // 3.2. 保存成功, 返回成功的响应数据: user
                res.send({code: 0, data: {_id: user._id, username, type}})  // 返回的数据中不要携带pwd
            })
        }
    })
})

// 登陆路由
router.post('/login', function (req, res) {
    // 1. 获取请求参数数据(username, password)
    const {username, password} = req.body
    // 2. 处理数据: 根据username和password去数据库查询得到user
    UserModel.findOne({username, password: md5(password)}, filter, function (err, user) {
        // 3. 返回响应数据
        // 3.1. 如果user没有值, 返回一个错误的提示: 用户名或密码错误
        if(!user) {
            res.send({code: 1, msg: '用户名或密码错误'})
        } else {
            // 生成一个cookie(userid: user._id), 并交给浏览器保存
            res.cookie('userid', user._id, {maxAge: 1000*60*60*24*7})
            // 3.2. 如果user有值, 返回user
            res.send({code: 0, data: user}) // user中没有pwd
        }
    })
})

// 更新用户路由
router.post('/update', function (req, res) {
    // 得到请求cookie的userid
    const userid = req.cookies.userid
    if(!userid) {// 如果没有, 说明没有登陆, 直接返回提示
        return res.send({code: 1, msg: '请先登陆'});
}

// 更新数据库中对应的数据
UserModel.findByIdAndUpdate({_id: userid}, req.body, function (err, user) {// user是数据库中原来的数据
    const {_id, username, type} = user
    // node端 ...不可用
    // const data = {...req.body, _id, username, type}
    // 合并用户信息
    const data = Object.assign(req.body, {_id, username, type})
    // assign(obj1, obj2, obj3,...) // 将多个指定的对象进行合并, 返回一个合并后的对象
    res.send({code: 0, data})
})
})


module.exports = router;
