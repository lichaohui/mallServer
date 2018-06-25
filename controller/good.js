//引入model模型
let good = require('../model/good')

//显示商品列表的方法
exports.index = function(req,res){
	let orderBy = req.query.orderby ? req.query.orderby : 'update_at'
	let [page, pagesize] = [
		req.query.page,
		parseInt(req.query.pagesize)
	]
	//查询条件
	let queries = JSON.parse(req.query.queries)
	good.fetch(queries,orderBy,page,pagesize,(err,data) => {
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

//获取某件商品的方法
exports.show = function(req,res){
	let id = req.params.id
	console.log(id)
	good.findById(id).exec((err,data) => {
		if(err){
			res.json({
				isSuccess: false,
				message: err.message
			})
		}else{
			console.log(data)
			res.json({
				isSuccess: true,
				data: data
			})
		}
	})
}