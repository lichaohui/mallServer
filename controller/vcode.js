//生成邮箱动态验证码的方法
exports.index = function(req, res, next) {
  /*
   * 想办法获取一个四位的随机数
   * 想通过Math.random()方法获取一个0到1之间的随机数
   * 该随机数是个位数很长的小数,
   * 类似于0.24952081912742163
   * 然后通过toString()方法将该随机数转为string类型的
   */
  var num = Math.random().toString();
  //将随机数转为string类型之后就可以通过字符串截取的方式获取一个随机的四位数了
  var vcode = num.substr(2, 4);
  //将获取到的四位的随机数保存到session中
  req.session.vcode = vcode;
  //下一步
  next();
};

//验证邮箱动态验证码是否匹配的方法
exports.verify = function(req, res, next) {
  if (req.body.params.vcode == req.session.vcode) {
    /*
     * 如果用户输入的验证码和我们发送的验证码相匹配
     * 就直接进行下一步
     */
    next();
  } else {
    /*
     * 否则返回错误信息
     */
    res.json({
      'isSuccess': false,
      'message': '动态验证码不正确！'
    });
  }
}