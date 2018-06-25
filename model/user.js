// 引入mongoose
let mongoose = require('mongoose')
//引入bcrypt来对密码进行加密
let bcrypt = require('bcrypt')

//定义用户数据表结构
let userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		unique: true,
		required: true
	},
	password: {
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
 * 为userSchema设置保存数据的方法，
 * 当保存的数据是新添加的时候，
 * 更新created_at和updated_at都为当前时间，
 * 如果数据不是新添加的是新修改的，
 * 则只更新updated_at为当前时间
 */
userSchema.pre('save',function(next) {
	var user = this
  /*
   * 可以通过isNew判断当前数据是否为新的
   * 如果是新的则返回true,
   * 否则返回false,
   * this表示当前保存的数据
   */
  if (this.isNew) {
    this.created_at = this.updated_at = Date.now()
  } else {
    this.updated_at = Date.now()
  }
  /*
   * 使用bcrypt的genSalt生成盐
   * 然后在回调函数中将生成的盐加给密码,
   * 再进行hash加密
   * 有两个参数，
   * 第一个参数是复杂程度，
   * 默认为10
   * 第二个参数是生成salt之后的回调函数
   * 回调函数中的第一个参数是err
   * 第二个参数是生成的salt(盐)
   * 再回调函数中可以用生成以后的盐加给密码进行hash
   */
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
			bcrypt.hash(user.password, salt, (err, hashresult) => {
				if (err) {
          return next(err)
        } else {
          /*
           * 如果没有错误
           * 就把密码和salt经过hash后得出的结果作为用户的密码
           * 保存到数据库中
           */
          user.password = hashresult
          //进行下一步
          next()
        }
			})
    }
	})
})

userSchema.post('findOneAndUpdate',function(doc) {
	this.update({ _id: doc._id},{ $set: { updated_at: new Date() } }, (err,data) => {
	})
})

/*
 * 为userScehma添加方法
 */
userSchema.methods = {
  //添加一个比较密码的方法
  comparePassword:function(password,callback){
    /*
     * bcrypt的compare()方法可以比较两个值是否匹配
     * 在这里我们可以比较表单提交的密码和数据库中的密码是否匹配
     * 回调函数中的第二个参数是一个布尔值，
     * 如果匹配则返回true,
     * 不匹配则返回false
     */
    bcrypt.compare(password,this.password,function(err,isMatch){
      if(err){
        return callback(err);
      }else{
        callback(null,isMatch);
      }
    })
  }
}

/*
 * 为userSchema添加一些自定义的静态方法
 * scheme对象的静态方法都在其statics的属性中保存
 * 所以可以通过为schema对象的statics属性添加成员，
 * 来为对象添加静态方法
 */
userSchema.statics = {
	//用户注册的方法
	register(user,callback){
		return user.save(callback)
	},
	//获取用户列表
	fetch(queries,orderBy,page,pagesize,callback){
		return this.find(queries).skip((page-1)*pagesize).limit(pagesize).sort(orderBy).exec(callback)
	},
	//通过邮箱查找用户是否存在（用于用户注册时验证邮箱是否被使用过）
	findByEmail(email,callback){
		return this.findOne({email: email}).exec(callback)
	}
}

/*
 * 将定义好的用户数据表结构添加到商品模型上
 * 第一个参数是数据表的表名
 */
let user = mongoose.model('user',userSchema)

//导出商品模型
module.exports = user