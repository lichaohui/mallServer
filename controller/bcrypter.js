//引入bcrypt加密模块
let bcrypt = require('bcrypt')

/* 
 * 生成密文的方法
 * 参数str是需要被加密的字符串
 */
exports.create = function(req,res,next){
	bcrypt.genSalt(10, (err, salt) => {
		if (err) {
			return next(err)
		} else {
			/*
			 * 如果没有错误就对生成的盐和密码进行hash
			 * 有三个参数，
			 * 第一个参数是密码
			 * 第二个参数是生成的salt
			 * 第三个参数是回调函数，
			 * 回调函数中有两个参数，
			 * 第一个参数是err,
			 * 第二个参数是hash后生成的值
			 */
			bcrypt.hash(req.body.params.password, salt, (err, hashresult) => {
				if (err) {
					console.log(err)
				} else {
					//返回加密后的密码
					req.body.params.password = hashresult
					next()
				}
			})
		}
	})
}