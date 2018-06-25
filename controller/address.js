//引入model模型
let address = require('../model/address')

//获取收货地址列表
exports.index = function(req,res){
	//查询条件
	let queries = {
		uid: req.session.user._id
	}
	address.fetch(queries,(err,data) => {
		if(err){
			res.json({
				isSuccess: false,
				message: err.message
			})
		}else{
			res.json({
				isSuccess: true,
				data: data
			})
		}
	})
}

//查询某个收货地址
exports.query = function(req,res){
	let id = req.params.id
	address.findById(id, (err,data) => {
		if(err){
			res.json({
				isSuccess: false,
				message: err.message
			})
		}else{
			res.json({
				isSuccess: true,
				data: data
			})
		}
	})
}

/*
 * 获取当前用户收货地址列表数量的方法
 * 作为store方法的前置方法
 * 因为每个用户的收货地址不可超过六条
 */
exports.counter = function(req,res,next){
	/*
	 * 每个人的收货地址最多只能有六个
	 * 所以在保存之前先查询出当前用户的收货地址的数量
	 * 如果已经有了6个收货地址则不允许继续添加
	 */
	address.count({'uid': req.session.user._id},(err,data) => {
		if(data == 6){
			res.json({
				'isSuccess': false,
				'message': '每个用户最多只能有6个收货地址'
			})
		}else{
			next()
		}
	})
}

/*
 * 处理默认地址的方法单独拿出来
 * 作为store和update方法的前置方法
 */
exports.dealDefault = function(req,res,next){
	/*
	 * 如果有设置为默认，
	 * 则将该用户的其他设置为默认的收货地址设置为非默认
	 * 因为每个用户只能有一个默认的收货地址
	 */
	if(req.body.params.isDefault){
		address.update({uid: req.session.user._id, isDefault: true}, { $set: { isDefault: false } },(err,data) => {
		  if(err){
				res.json({
					'isSuccess': false,
					'message': err.message
				})
			}else{
				next()
			}
		})
	}
}

//保存收货地址
exports.store = function(req,res){
	let newData = new address({
		'uid': req.session.user._id,
		'receiver': req.body.params.receiver,
		'phone': req.body.params.phone,
		'area': req.body.params.area,
		'address': req.body.params.address,
		'isDefault': req.body.params.isDefault
	})
	newData.save((err,data) => {
	  if(err){
		  res.json({
				'isSuccess': false,
				'message': err.message
			})
		}else{
			res.json({
				'isSuccess': true,
				'message': '保存成功'
			})
		}
	})	
}

//更新某条记录
exports.update = function(req,res){
	let id = req.params.id
	let newData = {
		'receiver': req.body.params.receiver,
		'phone': req.body.params.phone,
		'area': req.body.params.area,
		'address': req.body.params.address,
		'isDefault': req.body.params.isDefault
	}
	address.findOneAndUpdate({ _id: id }, { $set: newData}, {new: true}, (err, data) => {
		if(err){
			res.json({
				isSuccess: false,
				message: err.message
			})
		}else{
			res.json({
				isSuccess: true,
				message: '更新成功！'
			})
		}
	})
}

//删除某条记录
exports.delete = function(req,res){
  let id = req.params.id
	address.findByIdAndRemove(id, (err,data) => {
		if(err){
			res.json({
				isSuccess: false,
				message: err.message
			})
		}else{
			res.json({
				isSuccess: true,
				message: '删除成功！'
			})
		}
	})
}