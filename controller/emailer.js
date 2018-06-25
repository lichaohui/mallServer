//引入nodemailer组件
var nodemailer = require("nodemailer");

exports.send = function(req, res) {
  var transporter = nodemailer.createTransport({
    //服务商
    service: '163',
    //认证配置
    auth: {
      //使用哪个账号来发送邮件
      user: '17076467717@163.com',
      /*
       * 授权码
       * 在邮箱中设置获得，并非邮箱的登录密码
       */
      pass: 'misswife19900519'
    }
  })
  var mailOptions = {
		// 发送者  
    from: '17076467717@163.com',
    // 接受者,可以同时发送多个,以逗号隔开  
    to: req.body.params.email,
    // 标题  
    subject: '萌萌猫会员注册验证',
    // 文本  
    text: '您好，您的验证码是' + req.session.vcode + '，请及时验证',
  }
  transporter.sendMail(mailOptions,
  function(err, info) {
    if (err) {
      res.json({
        'isSuccess': false,
        'message': '邮件发送失败，请稍后再试！'
      })
    } else {
      //如果短信发送成功则返回提示信息
      res.json({
        'isSuccess': true,
        'message': '邮箱验证码发送成功！'
      })
    }
  })
}