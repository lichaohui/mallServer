var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
//引入session模块
var session = require('express-session')

/*
 * 引入connect-redis模块用来做会话持久化
 * 可以将用户的session信息存储到redis缓存中中
 * session的存储方式有四种：
 * 1.内存（默认）2.cookie 3.redis/memcached等缓存 4.数据库
 * 推荐使用redis/memcathed缓存来存储
 */
var redisStore=require('connect-redis')(session)

var index = require('./routes/index')
var users = require('./routes/users')
var good = require('./routes/good')
var shopcar = require('./routes/shopcar')
var captcha = require('./routes/captcha')
var emailer = require('./routes/emailer')
var address = require('./routes/address')
var order = require('./routes/order')

//设置一个存储数据库地址的变量
var dbUrl='mongodb://localhost/mmcat';
//连接数据库,传入上面定义好的dbUrl
mongoose.connect(dbUrl);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//中间件中使用session
app.use(session({
  /*
   * 通过设置的 secret 字符串，
   * 来计算 hash 值并放在 cookie 中，
   * 使产生的 signedCookie 防篡改。
   */
  secret:'mmcat',
  /*
   * session 的存储方式,
   * 默认放到内存中
   * 这里我们设置存储到redis中
   */
  store:new redisStore(),
	resave: false,
  saveUninitialized: true,
	proxy: true
}))
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index)
app.use('/users', users)
app.use('/good', good)
app.use('/shopcar', shopcar)
app.use('/captcha', captcha)
app.use('/emailer', emailer)
app.use('/address', address)
app.use('/order', order)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
