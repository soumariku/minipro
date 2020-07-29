// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  collection = event.collection
  id = event.id
  data = event.data
  return await db.collection(collection).doc(id).update({
    data: data
  })

}