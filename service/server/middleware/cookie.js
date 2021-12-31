//cookic控制中间件
const User = require('../model/userModel')
module.exports = async (req, res, next) => {
  const userId = req.user.id;
  const result =await User.findById(userId);
  // 判断是否为超管
  if (result.jurisdiction === 'superAdmin') {
    console.log("本次的connect.sid为", req.signedCookies);
    next()
  } else {
    res.send({ data: "没有权限", code: 0 })
  }
}
