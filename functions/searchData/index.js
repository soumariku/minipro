// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100
const _ = db.command
exports.main = async (event, context) => {
  if(!!event.order){
    order = event.order
  }
  collection = event.collection
  data = event.data
  // 先取出集合记录总数
  let countResult 
  await db.collection(collection).count().then((res)=>{
    countResult = res
  })
  const _ = db.command
  let batchTimes = 0
  if(countResult.total!=0){
    const total = countResult.total
    // 计算需分几次取
    batchTimes = Math.ceil(total / 100)
  }else{
    batchTimes = 0
  }
  
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection(collection).where(data).orderBy('time', 'desc').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  if(batchTimes==0){
    return {
      data: [],
      errMsg: [],
    }
  }else{
    return (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data),
        errMsg: acc.errMsg,
      }
    })
  }
  
}