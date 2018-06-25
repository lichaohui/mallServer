// 引入mongoose
let mongoose = require('mongoose')

let _id = mongoose.Schema.Types.ObjectId

//定义订单数据表结构
let orderSchema = new mongoose.Schema({
	numbering: {
		type: String,
		required: true,
		unique: true
	},
	uid: {
		type: _id,
		ref: 'users',
		required: true
	},
	goods: [],
	aid: {
		type: _id,
		ref: 'addresses',
		required: true
	},
	status: {
		type: String,
		required: true
	},
	created_at:{
    type: Date,
    default: Date.now()
  },
  updated_at:{
    type: Date,
    default: Date.now()
  }
})

/*
 * 通过Schema对象的pre()方法可以为数据模型的操作（增删该查设置回调函数），
 * 有两个参数，
 * 第一个参数是要为哪个操作设置回调，
 * 第二个参数就是要设置的回调方法
 * 为orderSchema设置保存数据的方法，
 * 当保存的数据是新添加的时候，
 * 更新created_at和updated_at都为当前时间，
 * 如果数据不是新添加的是新修改的，
 * 则只更新updated_at为当前时间
 */
orderSchema.pre('save',function(next){
	//先设置更新时间
  this.created_at = this.updated_at = Date.now()
	next()
})

/*
 * 为orderSchema添加一些自定义的静态方法
 * scheme对象的静态方法都在其statics的属性中保存
 * 所以可以通过为schema对象的statics属性添加成员，
 * 来为对象添加静态方法
 */
orderSchema.statics = {
	fetch(queries,page,pagesize,callback){
		return this.find(queries).skip((page-1)*pagesize).limit(pagesize).exec(callback)
	}
}

/*
 * 将定义好的商品数据表结构添加到商品模型上
 * 第一个参数是数据表的表名
 */
let order = mongoose.model('order',orderSchema)

//导出商品模型
module.exports = order