var express = require('express')
var router = express.Router()

//引入user控制器
let user = require('../controller/user')
//引入shopcar控制器
let shopcar = require('../controller/shopcar')

/* GET users listing. */
router.get('/', user.isLogin, shopcar.index)

//添加购物车
router.post('/', user.isLogin, shopcar.store)

//编辑购物车
router.post('/:id', user.isLogin, shopcar.edit)

//删除购物车
router.delete('/:id', user.isLogin, shopcar.delete)

module.exports = router