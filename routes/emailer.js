var express = require('express')
var router = express.Router()

var emailer = require('../controller/emailer')
var vcode = require('../controller/vcode')

//发送邮箱验证码的路由
router.post('/',vcode.index,emailer.send)

module.exports = router
