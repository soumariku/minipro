const API = require('../../utils/API.js');
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orders: [],//用来接收接口返回数据
    goods:[],
    sumprice:''
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id:options.id
    })
    this.getOrders(options.id)
  },
  getOrders(id){
    app.globalData.db.collection('orders').where({
      _id:id
    }).get().then((res)=>{
      console.log(res)
      let showmsg = []
      let state = false
      for(var i=0;i<res.data.length;i++){
        //状态：A-预约配送、B-商品自取、C-订单完成
        if(res.data[i].orderState == 'A'){
          res.data[i].orderState = '预约配送'
        }else if(res.data[i].orderState == 'B'){
          res.data[i].orderState = '商品自取'
        }else{
          res.data[i].orderState = '订单完成'
          state = true
        }
      }
      let gmsg = res.data[0].goodsmsg
      let pmsg = res.data[0].goodspic
      for(var i=0;i<gmsg.length;i++){
        let goodsmsg = {msg:gmsg[i],pic:pmsg[i]}
        showmsg.push(goodsmsg)
      }
      this.setData({
        orders:res.data,
        goods:showmsg,
        isComplete:state,
        orderState:res.data[0].orderState,
        sumprice:res.data[0].sumprice,
        remarks:res.data[0].remarks,
        orderTime:res.data[0].orderTime
      })
    })
  },
  updateCompleteState(){
    let id = this.data.id
    wx.showModal({
      title: '提示',
      content: '选择配送方式',
      cancelText:'确定',
      confirmText:'取消',
      cancelColor:'#D6463C',
      success: function(res){
        if(res.confirm){
          console.log('按了取消')
        }else{
          app.globalData.db.collection('orders').doc(id).update({
            data:{
              orderState:'C'
            },
            success: function(res) {
              wx.navigateBack({
                delta: 1,  // 返回上一级页面。
                success: function() {
                    console.log('成功！')
                }
              })
            }
          })
        }
      }
    })
    
  },
  // 计算金额
  totalPrice: function() {
    let list = this.data.goodsCar;
    let total = 0;
    // 循环列表得到每个数据
    for (let i = 0; i < list.length; i++) {
      // 判断选中计算价格
      if (list[i].selected) {
        // 所有价格加起来 count_money
        total += list[i].count * list[i].npriceGood;
      }
    }
    // 最后赋值到data中渲染到页面
    this.setData({
      goodsCar: list,
      totalPrice: total.toFixed(2)
    });
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.data.goodsCar = API.orderinfo;
    this.totalPrice();
  }
})