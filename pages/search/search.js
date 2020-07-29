// pages/search/search.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchmsg:''
  },
  // 取消搜索,返回主页面
  hideInput: function () {
    wx.switchTab({
      //跳转，返回主页面路径
      url: '../home/home'   
    })
  },
  changeseearch(e){
    let inputmsg = e.detail.value;
    this.setData({
      searchmsg:inputmsg
    })
  },
  getorders(){
    let _this = this
    const _ = app.globalData.db.command
    app.globalData.db.collection('orders').where(_.or([
      {
        buyer:app.globalData.db.RegExp({
            regexp:'.*' + _this.data.searchmsg + '.*',
            option:'i'
        })
      },
      {
        _id:app.globalData.db.RegExp({
            regexp:_this.data.searchmsg,
            option:'i'
        })
      }
    ])).get({
        success: function(res) {
            console.log(res)
            _this.setData({
              ordersList:res.data
            })
        }
    })
  },
  toOrderDetail(e){
    console.log(e)
    wx.navigateTo({
      url: './../updateOrders/updateOrders?id='+e.currentTarget.dataset.id,
    })
  },
  getgoods:function(e){
    var inputmsg = "";
    inputmsg = e.detail.value;
    var good = "";
    if(inputmsg!=''){
    app.globalData.db.collection('goods').where({
      name:{								//columnName表示欲模糊查询数据所在列的名
        $regex:'.*' + inputmsg + '.*',		//queryContent表示欲查询的内容，‘.*’等同于SQL中的‘%’
        $options: 'i'							//$options:'1' 代表这个like的条件不区分大小写,详见开发文档
      }
    }).get().then((res)=>{
      good = res.data
      console.log(res)
      this.setData({
        //id: ids,  //把获取的自定义id赋给当前组件的id(即获取当前组件)  
        goods: good
      })
    })
  } 
  },
  turnmsg:function(e){
    // console.log(e.currentTarget.dataset.id)
    let theTurnID = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './../details/details?id='+theTurnID
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getgoods()
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