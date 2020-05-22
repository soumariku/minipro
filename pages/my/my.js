// pages/my/my.js
const API = require('../../utils/API.js')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    isAdmin:{},
    hasUserInfo: false,
    showOneButtonDialog: false,
    showcustomerBtnDialog: false,
    showtelBtnDialog:false,
    oneButton: [],
    customerBtn:[{text: '取消'}], 
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasLogin:false
  },
  calling:function(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phonenum, //此号码并非真实电话号码，仅用于测试
      success:function(){
        console.log("拨打电话成功！")
      },
      fail:function(){
        console.log("拨打电话失败！")
      }
    })
  },
  tapOneDialogButton(e) {
      this.setData({
          showOneButtonDialog: true
      })
  },
  customerBtnDialog(e){
    let newvalue = !this.data.showcustomerBtnDialog
    this.setData({
      showcustomerBtnDialog: newvalue
  })
  },
  telBtnDialog(e){
    let newvalue = !this.data.showtelBtnDialog
    this.setData({
      showtelBtnDialog: newvalue
  })
  },
  //跳到待收货
  tobereceived(){
    wx.navigateTo({
      url: './../bereceived/bereceived',
    })
  },
  toappointment(){
    wx.navigateTo({
      url: './../appointment/appointment',
    })
  },
  tocomplete(){
    wx.navigateTo({
      url: './../complete/complete',
    })
  },
  //跳转我的收藏
  tocollecton(){
    wx.navigateTo({
      url: '../collection/collection',
    })
  },
  tapDialogButton(e) {
    this.setData({
        dialogShow: false,
        showOneButtonDialog: false
    })
  },
  toadmin(){
    wx.navigateTo({
      url: './../administrator/administrator',
    })
  },
  clearStorage(){
    console.log('111')
    try {
      wx.clearStorageSync()
    } catch(e) {
      alert('清理失败')
    }
  },
  login(){
    wx.navigateTo({
      url: './../index/index',
    })
  },
  onLoad: function (options) {
    this.setData({
      hasLogin:app.globalData.hasLogin
    })
    if (app.globalData.role == 'administrator') {
      this.setData({
        userInfo: app.globalData.userInfo,
        isAdmin: true
      })
    }else(
      this.setData({
        userInfo: app.globalData.userInfo,
        isAdmin: false
      })
    )
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  tosetting(e){
    let id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: './../customersetting/customersetting?id='+id,
    })
  },
  toSubscribe(){
    // wx.requestSubscribeMessage({
    //   tmplIds: ['DHyPxxxYk-x_1_tsWCSliKOUZ8A808IzPc6-r0yO0gI'],
    //   success(res) {
    //     console.log('授权成功')
    //     app.testSubmit()
    //   },
    //   fail(res) {
    //     console.log('授权失败', res)
    //   }
    // })
    app.testSubmit()
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  bindViewTap(){
    if(this.data.hasLogin==true){
      wx.navigateTo({
        url: '../personalData/personalData',
      })
    }else{
      wx.navigateTo({
        url: '../index/index',
      })
    }
    
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
    if(API.orderinfo.length>0){
      let num = 0
      for(var item in API.orderinfo){ 
        num +=Number(API.orderinfo[item].count)
      }
      wx.setTabBarBadge({
        index: 2,
        text: String(num)
      })
    }else{
      wx.hideTabBarRedDot({
        index: 2,
      })
    }
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