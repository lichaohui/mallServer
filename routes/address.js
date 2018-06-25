var express = require('express')
var router = express.Router()

//引入user控制器
let user = require('../controller/user')
//引入address控制器
let address = require('../controller/address')

/* GET users listing. */
router.get('/', user.isLogin, address.index)

//获取某条收货地址
router.get('/:id', user.isLogin, address.query)

//添加收货地址
router.post('/', user.isLogin, address.counter, address.dealDefault, address.store)

//更新收货地址
router.put('/:id', user.isLogin, address.dealDefault, address.update)

//删除收货地址
router.delete('/:id', user.isLogin, address.delete)

module.exports = router