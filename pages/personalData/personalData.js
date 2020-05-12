// pages/personalData/personalData.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  getData(){
    app.globalData.db.collection('customer').where({
      name:app.globalData.userInfo.nickName
    }).get().then((res=>{
      this.setData({
        telephone:res.data[0].telephone,
        address:res.data[0].address,
        truename:res.data[0].truename
      })
    }))
  },
  changeTrueName(e){
    this.setData({
      truename:e.detail.value
    })
  },
  changetelephone(e){
    this.setData({
      telephone:e.detail.value
    })
  },
  changeadderss(e){
    this.setData({
      address:e.detail.value
    })
  },
  changeMsg(){
    wx.showLoading({
      title: '',
    })
    let _this = this
    app.globalData.db.collection('customer').where({
      name:app.globalData.userInfo.nickName
    }).get().then((res)=>{
      if(res.data.length==0){
        console.log(res)
        app.globalData.db.collection('customer').add({
          data:{
            name:app.globalData.userInfo.nickName,
            truename:_this.data.truename,
            telephone:_this.data.telephone,
            address:_this.data.address
          }
        }).then((res)=>{
          console.log(res)
          wx.hideLoading()
          wx.showToast({
            title: '更改成功',
            icon: 'success',
            duration: 3000
          });
        })
      }else{
        let id = res.data[0]._id;
        wx.cloud.callFunction({
          name: "updateData",
          data: {
            id:id,
            collection:'customer',
            data:{
              truename:_this.data.truename,
              telephone:_this.data.telephone,
              address:_this.data.address
            }
          }
        }).then((res)=>{
          console.log(res)
          wx.hideLoading()
          wx.showToast({
            title: '更改成功',
            icon: 'success',
            duration: 3000
          });
        })
      }
    })
  },
  returnlogin(){
    wx.navigateTo({
      url: '../index/index',
    })
    wx.clearStorage()
    console.log('成功')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
    this.setData({
      userInfo: app.globalData.userInfo,
      isAdmin: true
    })
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