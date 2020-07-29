// 云函数入口文件
const cloud = require('wx-server-sdk')
const got = require('got')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  let postResponse = await got('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxb4a54f6b5b9d3cc7&secret=86599dfc783d399e7fdc8cf05a8d89e5')
  return postResponse.body
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}