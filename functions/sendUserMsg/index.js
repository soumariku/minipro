// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  await cloud.openapi.customerServiceMessage.send({
    touser: 'osz8547AdE2Na07HgNs6Cxc8TQ9Q',
    msgtype: 'text',
    text: {
      content: event.msg,
    },
  })
  return 'success'
}