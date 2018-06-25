var express = require('express')
var router = express.Router()

//引入good控制器
let good = require('../controller/good')

/* GET users listing. */
router.get('/', good.index)

router.get('/:id', good.show)

module.exports = router