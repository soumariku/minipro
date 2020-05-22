// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  await cloud.openapi.customerServiceMessage.send({
    touser: 'osz8541U2Cnv1o4ywrOU9awC4bLU',
    msgtype: 'text',
    text: {
      content: event.msg,
    },
  })
  return 'success'
}