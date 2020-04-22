// 云函数入口文件
const cloud = require('wx-server-sdk')
const got = require('got')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  let postResponse = await got('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx32372f6ba81791b7&secret=e50ac757af25dbc20b42f9e92a157f51')
  return postResponse.body
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}