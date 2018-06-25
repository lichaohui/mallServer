var express = require('express')
var router = express.Router()

//引入captcha控制器
let captcha = require('../controller/captcha')

/* GET users listing. */
router.get('/', captcha.index)

module.exports = router