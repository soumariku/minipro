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
      content: '您收到个订单，请上小程序上查看，谢谢！',
    },
  })
  return 'success'
}