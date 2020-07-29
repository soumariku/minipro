// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: event.openid, //要推送给那个用户
      data: {//推送的内容
        name3: {
          value: '小程序入门课程'
        },
        number4: {
          value: 111
        },
        amount5: {
          value: 111
        },
        thing6: {
          value: '第一章第一节'
        },
        thing7: {
          value: '第一章第一节'
        }
      },
      templateId: 'DHyPxxxYk-x_1_tsWCSliKOUZ8A808IzPc6-r0yO0gI' //模板id
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}