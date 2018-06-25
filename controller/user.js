//引入model模型
let user = require('../model/user')

/*
 * 验证用户邮箱是否唯一的方法
 * (用户用户注册时)
 */
exports.verifyUnique = function(req,res){
	user.findByEmail(req.body.params.email,(err,data) => {
		if(data){
			//如果存在则说明该邮箱已经被使用过了
			res.json({
				isSuccess: false,
				message: '该邮箱已经被注册过了!'
			})
		}else{
			res.json({
				isSuccess: true
			})
		}
	})
}

/*
 * 验证用户是否存在的方法
 * (用于用户邮箱验证登录的时候)
 */
exports.verifyExist = function(req,res){
	user.findByEmail(req.body.params.email,(err,data) => {
		if(data){
			//如果存在则说明该邮箱已经被使用过了
			res.json({
				isSuccess: true,
				message: '邮箱验证成功!'
			})
		}else{
			res.json({
				isSuccess: false,
				message: '该用户不存在！'
			})
		}
	})
}

/*
 * 用户注册
 */
exports.register = function(req,res){
	let newuser = new user({
		name: req.body.params.name,
		email: req.body.params.email,
		password: req.body.params.password
	})
	user.register(newuser,(err,data) => {
	  if(err){
			res.json({
				isSuccess: false,
				message: '注册失败，请稍后再试'
			})
		}else{
			req.session.user = data
			res.json({
				isSuccess: true,
				user: req.session.user,
				message: '注册成功!'
			})
		}
	})
}

/*
 * 判断用户是否登录的方法
 */
exports.isLogin = function(req,res,next){
	if(req.session.user){
    next()
  }else{
    res.json({
			isSuccess: false,
			message: '您还未登录'
		})
  }
}

/*
 * 用户登录
 */
exports.login = function(req,res){
	let postuser = req.body.params
	user.findByEmail(postuser.email,(err,data) => {
		if(data){
			/*
       * 如果用户存在则继续验证密码
       * 调用我们自己在model中定义的comparePassword()方法进行验证
       */
      data.comparePassword(postuser.password, (err, isMatch) => {
				if (isMatch) {
					req.session.user = data
					res.json({
						isSuccess: true,
						user: req.session.user,
						message: '登录成功!'
					})
				} else {
					//如果密码不匹配则返回错误信息
					res.json({
						isSuccess: false,
						message: '密码错误！'
					})
				}
			})
		}else{
			res.json({
				isSuccess: false,
				message: '该用户不存在！'
			})
		}
	})
}

/*
 * 用户邮箱也验证登录并更新密码
 */
exports.vlogin = function(req,res){
	let postuser = req.body.params
	user.findOneAndUpdate({ email: postuser.email }, { $set: { password: postuser.password }},{new: true},(err,doc) => {	
		if(err){
			res.json({
				isSuccess: false,
				message: err.message
			})
		}else{
			res.json({
				isSuccess: true,
				message: '更新密码成功！',
				user: doc
			})
		}
	})
}

/*
 * 退出登录
 */
exports.logout = function(req,res){
	//删除session
  delete req.session.user
	res.json({
		isSuccess: true,
		user: req.session.user
	})
}