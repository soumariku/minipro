// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  await cloud.openapi.customerServiceMessage.send({
    touser: 'o6HCI5NR8UKfn6CBFAELDgL51ZwA',
    msgtype: 'text',
    text: {
      content: event.msg,
    },
  })
  return 'success'
}