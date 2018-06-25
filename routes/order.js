var express = require('express')
var router = express.Router()

//引入user控制器
let user = require('../controller/user')
//引入order控制器
let order = require('../controller/order')

/* GET users listing. */
router.get('/', user.isLogin, order.index)

//生成订单
router.post('/', user.isLogin, order.store)

//删除订单
router.delete('/:id', user.isLogin, order.delete)

module.exports = router