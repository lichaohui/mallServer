//引入model模型
let order = require('../model/order')
let shopcar = require('../model/shopcar')
let good = require('../model/good')

//获取用户订单的方法
exports.index = function(req,res){
	let [page, pagesize] = [
		req.query.page,
		parseInt(req.query.pagesize)
	]
	//查询条件
	let queries = {
		uid: req.session.user._id
	}
	order.fetch(queries,page,pagesize,(err,datas) => {
		if(err){
			res.json({
				isSuccess: false,
				message: err.message
			})
		}else{
			let goodIds = []
			for(let order of datas){
				for(let good of order.goods){
					goodIds.push(good.gid)
				}
			}
			let goods = good.find({'_id': { $in: goodIds }}).exec((err, goodDatas) => {
				for(let data of datas){
					for(let good of data.goods){
						let filterGood = goodDatas.filter((goodData) => {
						  return goodData._id == good.gid+''
						})[0]
						good.name = filterGood.name
						good.price = filterGood.price
					}
				}
				res.json({
					isSuccess: true,
					data: datas
				})
			})
		}
	})
}

//添加订单的方法
exports.store = function(req,res){
	let [uid, aid] = [ 
		req.session.user._id,
		req.body.params.aid
	]
	
	/*
	 * 用户有可能通过购物车和直接购买商品两种方式下订单
	 * 这里需要先判断一下是通过哪种方式下的订单
	 * 如果有good id传递过来则说明是直接购买的商品
	 * 如果没有则是通过购物车的方式下的订单
	 */
	if(req.body.params.gid){
		//这里是通过直接购买商品下订单
	}else{
		/*
		 * 没有gid则是通过购物车下的订单
		 * 则先去查找用户被选中的购物车
		 */
		shopcar.find({'uid': uid, isSelected: true}).exec((err,datas) => {
			let goods = []
			for(let data of datas){
				let good = {}
				good.gid = data.gid
				good.count = data.count
				goods.push(good)
			}
			
			let neworder = new order({
				numbering: new Date().getTime() + "",
				uid: uid,
				goods: goods,
				aid: aid,
				status: '待付款'
			})
			neworder.save((err,data) => {
				if(err){
					res.json({
						'isSuccess': false,
						'message': err.message
					})
				}else{
					/*
					 * 保存成功后就要相应的删除掉用户购物车里的选中的数据
					 * 因为那些购物车已经生成到订单里了
					 * 所以不应该出现在购物车中了
					 */
					shopcar.remove({'uid': uid, isSelected: true}).exec((err) => {
						if(err){
						}else{
							res.json({
							'isSuccess': true,
							'message': '订单生成成功，请及时支付！'
						})
						}
					})
				}
			})
		})
	}
}

//删除订单
exports.delete = function(req,res){
  let id = req.params.id
	order.findByIdAndRemove(id, (err,data) => {
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