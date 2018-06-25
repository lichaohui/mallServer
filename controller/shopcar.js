//引入model模型
let shopcar = require('../model/shopcar')

//获取用户购物车的方法
exports.index = function(req,res){
	let [page, pagesize] = [
		req.query.page,
		parseInt(req.query.pagesize)
	]
	//查询条件
	let queries = {
		uid: req.session.user._id
	}
	shopcar.fetch(queries,page,pagesize,(err,data) => {
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

//添加购物车的方法
exports.store = function(req,res){
	//先查询当前商品是否已经存在于当前用户的购物车列表中
	let [uid,gid,count] = [
		req.session.user._id,
		req.body.params.gid,
		req.body.params.count ? req.body.params.count : 1,
	]
	shopcar.query({uid: uid, gid: gid},(err,data) => {
		if(data){
			//如果存在则直接更新数量+1
			data.update({count: data.count+1},(err,data) => {
				if(err){
					res.json({
						'isSuccess': false,
						'message': err.message
					})
				}else{
					res.json({
						'isSuccess': true,
						'message': '添加购物车成功！'
					})
				}
			})
		}else{
			//不存在则直接存储新数据
			let newshopcar = new shopcar({
				'uid': uid,
				'gid': gid,
				'count': count
			})
			newshopcar.save((err,data) => {
				if(err){
					console.log(err)
					res.json({
						'isSuccess': false,
						'message': err.message
					})
				}else{
					res.json({
						'isSuccess': true,
						'message': '添加购物车成功！'
					})
				}
			})
		}
	})
}

//编辑购物车的方法
exports.edit = function(req,res){
	let id = req.params.id
	shopcar.findOneAndUpdate({ _id: id }, { $set: { count: req.body.params.count, isSelected: req.body.params.isSelected }}, {new: true}, (err, data) => {
		if(err){
			res.json({
				isSuccess: false,
				message: err.message
			})
		}else{
			res.json({
				isSuccess: true,
				message: '编辑成功！'
			})
		}
	})
}

//删除购物车
exports.delete = function(req,res){
  let id = req.params.id
	shopcar.findByIdAndRemove(id, (err,data) => {
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