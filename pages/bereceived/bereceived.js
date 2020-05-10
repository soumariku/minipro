const API = require('../../utils/API.js');
const app = getApp();
Page({

  data: {
    carisShow: false, //购物车是否有商品
    orders: [],//用来接收接口返回数据
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getOrders()
  },
  getOrders(){
    const _ =  app.globalData.db.command
    app.globalData.db.collection('customer').where({
      name:app.globalData.userInfo.nickName
    }).get().then((res)=>{
      let truename = res.data[0].truename
      app.globalData.db.collection('orders').where({
        buyer : truename,
        orderState : _.in(['A', 'B'])
      }).get().then((res)=>{
        console.log(res)
        for(var i=0;i<res.data.length;i++){
          //状态：A-预约配送、B-商品自取、C-订单完成
          if(res.data[i].orderState == 'A'){
            res.data[i].orderState = '预约配送'
          }else if(res.data[i].orderState == 'B'){
            res.data[i].orderState = '商品自取'
          }else{
            res.data[i].orderState = '订单完成'
          }
        }
        this.setData({
          orders:res.data
        })
        this.checklist()
      })
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
  toOrderDetail(e){
    console.log(e)
    wx.navigateTo({
      url: './../orderdetail/orderdetail?id='+e.currentTarget.dataset.id,
    })
  },
  // 结算生成订单
  goOrder:function(){
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '确认生成订单？',
      success: function(res){
        if(res.confirm){
          // 携带订单信息生成订单
          let list = _this.data.goodsCar;
          let nlist = [];
          for(let i=0;i<list.length;i++){
            if(list[i].selected){
              nlist.push(list[i]);
            }
          }
          API.orderinfo = nlist;//将订单的信息传给API.js
          wx.navigateTo({
            url: '../order/order'
          })
        }else{
          console.log(res);
        }
      }
    })
  },
  checklist(){
    if (!this.data.orders.length) {
      this.setData({
        carisShow: true
      });
    }else{
      this.setData({
        carisShow: false
      });
    }
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
    // this.checklist();
  }
})