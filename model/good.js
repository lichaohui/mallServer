// 引入mongoose
let mongoose = require('mongoose')

//定义商品数据表结构
let goodSchema = new mongoose.Schema({
	name: {
		type: String,
		unique: true,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	image: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	created_at:{
    type:Date,
    default:Date.now()
  },
  updated_at:{
    type:Date,
    default:Date.now()
  }
})

/*
 * 通过Schema对象的pre()方法可以为数据模型的操作（增删该查设置回调函数），
 * 有两个参数，
 * 第一个参数是要为哪个操作设置回调，
 * 第二个参数就是要设置的回调方法
 * 为goodSchema设置保存数据的方法，
 * 当保存的数据是新添加的时候，
 * 更新created_at和updated_at都为当前时间，
 * 如果数据不是新添加的是新修改的，
 * 则只更新updated_at为当前时间
 */
goodSchema.pre('save',function(next){
    this.created_at = this.updated_at = Date.now()
    //然后通过next()进行下一步操作
    next()
})

/*
 * 为goodSchema添加一些自定义的静态方法
 * scheme对象的静态方法都在其statics的属性中保存
 * 所以可以通过为schema对象的statics属性添加成员，
 * 来为对象添加静态方法
 */
goodSchema.statics = {
	fetch(queries,orderBy,page,pagesize,callback){
		return this.find(queries).skip((page-1)*pagesize).limit(pagesize).sort(orderBy).exec(callback)
	}
}

/*
 * 将定义好的商品数据表结构添加到商品模型上
 * 第一个参数是数据表的表名
 */
let good = mongoose.model('good',goodSchema)

//导出商品模型
module.exports = good