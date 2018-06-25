var express = require('express');
var router = express.Router();

var user = require('../controller/user')
var captcha = require('../controller/captcha')
var vcode = require('../controller/vcode')
var bcrypter = require('../controller/bcrypter')

/* GET users listing. */
//router.get('/', user.index)

//验证用户邮箱是否唯一的路由
router.post('/verifyUnique',captcha.verify,user.verifyUnique)

//验证用户是否存在的路由
router.post('/verifyExist',captcha.verify,user.verifyExist)

//实现用户注册功能的路由
router.post('/register',vcode.verify,user.register)

//用户登录功能的路由
router.post('/login',user.login)

//实现用户验证路由并修改密码的路由
router.post('/vlogin',vcode.verify,bcrypter.create,user.vlogin)

//实现用户退出功能的路由
router.post('/logout',user.logout)

module.exports = router;
