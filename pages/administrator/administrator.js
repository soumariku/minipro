// pages/administrator/administrator.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    category:false,
    gooods:false,
    orders:false,
    begin:true,
  },
  previewReturn(){
    if(this.data.category==true){
      this.setData({
        category:false,
        begin:true
      })
    }else if(this.data.goods==true){
      this.setData({
        goods:false,
        begin:true
      })
    }else{
      this.setData({
        orders:false,
        begin:true
      })
    }
    
  },
  updateCategory(){
    this.setData({
      category:true,
      begin:false
    })
    app.globalData.db.collection('CATEGORY').get().then((res)=>{
      console.log(res.data)
      this.setData({
        catagoryList:res.data
      })
    })
  },
  updategoods(){
    this.setData({
      goods:true,
      begin:false
    })
    app.globalData.db.collection('goods').get().then((res)=>{
      console.log(res.data)
      this.setData({
        goodsList:res.data
      })
    })
  },
  updateorders(){
    this.setData({
      orders:true,
      begin:false,
      ordersList:[]
    })
    app.globalData.db.collection('orders').get().then((res)=>{
      console.log(res.data)
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
        ordersList:res.data
      })
    })
  },
  updateCompleteState(e){
    let id = e.currentTarget.dataset.id
    let _this = this
    wx.showModal({
      title: '提示',
      content: '请确定是否收货',
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
              console.log(res)
              wx.showToast({
                title: '已完成！',
                icon: 'success',
                duration: 3000
              });
              _this.updateorders()
            }
          })
        }
      }
    })
    
  },
  toOrderDetail(e){
    console.log(e)
    wx.navigateTo({
      url: './../orderdetail/orderdetail?id='+e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})