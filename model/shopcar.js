// 引入mongoose
let mongoose = require('mongoose')

let _id = mongoose.Schema.Types.ObjectId

//定义商品数据表结构
let shopcarSchema = new mongoose.Schema({
	uid: {
		type: _id,
		ref: 'users'
	},
  gid: {
		type: _id,
		ref: 'good'
	},
	count: {
		type: Number,
		default: 1
	},
	isSelected: {
		type: Boolean,
		default: false
	},
	created_at: {
    type: Date,
    default: Date.now()
  },
  updated_at: {
    type: Date,
    default: Date.now()
  }
})

/*
 * 通过Schema对象的pre()方法可以为数据模型的操作（增删该查设置回调函数），
 * 有两个参数，
 * 第一个参数是要为哪个操作设置回调，
 * 第二个参数就是要设置的回调方法
 * 为shopcarSchema设置保存数据的方法，
 * 当保存的数据是新添加的时候，
 * 更新created_at和updated_at都为当前时间，
 * 如果数据不是新添加的是新修改的，
 * 则只更新updated_at为当前时间
 */
shopcarSchema.pre('save',function(next){
    this.created_at = this.updated_at = Date.now()
    //然后通过next()进行下一步操作
    next()
})

shopcarSchema.post('findOneAndUpdate',function(doc) {
	this.update({ _id: doc._id},{ $set: { updated_at: new Date() } }, (err,data) => {
	})
})

/*
 * 为goodSchema添加一些自定义的静态方法
 * scheme对象的静态方法都在其statics的属性中保存
 * 所以可以通过为schema对象的statics属性添加成员，
 * 来为对象添加静态方法
 */
shopcarSchema.statics = {
	//获取购物车列表
	fetch(queries,page,pagesize,callback){
		return this.find(queries).skip((page-1)*pagesize).limit(pagesize).populate('gid', 'name price').exec(callback)
	},
	//根据条件查询某条记录
	query(queries,callback){
		return this.findOne(queries).exec(callback)
	}
}

/*
 * 将定义好的购物车数据表结构添加到商品模型上
 * 第一个参数是数据表的表名
 */
let shopcar = mongoose.model('shopcar',shopcarSchema)

//导出模型
module.exports = shopcar