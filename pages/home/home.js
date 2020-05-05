// pages/home/home.js
const app = getApp()
const db = wx.cloud.database({
  //这个是环境ID不是环境名称
  env:'minishop-kxw64'
})
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    imgUrl: [
      "/icon/swiper1.jpg",//存在云里的图片，可以改成你们的地址
      "/icon/swiper2.jpg"
    ],
    imgInfoArr: [{
      src: 'cloud://minishop-kxw64.6d69-minishop-kxw64-1301898931/pic1.jpg',
      id: 1
      }, {
      src: 'cloud://minishop-kxw64.6d69-minishop-kxw64-1301898931/pic1.jpg',
      id: 2
      }, {
      src: 'cloud://minishop-kxw64.6d69-minishop-kxw64-1301898931/pic1.jpg',
      id: 3
      }, {
      src: 'cloud://minishop-kxw64.6d69-minishop-kxw64-1301898931/pic1.jpg',
      id: 4
      }, {
      src: 'cloud://minishop-kxw64.6d69-minishop-kxw64-1301898931/pic1.jpg',
      id: 5
      }, {
      src: 'cloud://minishop-kxw64.6d69-minishop-kxw64-1301898931/pic1.jpg',
      id: 6
      }, {
      src: 'cloud://minishop-kxw64.6d69-minishop-kxw64-1301898931/pic1.jpg',
      id: 7
      }],
      
    classList:[],
    indiicatorDots: true,
    imgInfoArrLength: '', // 轮播图列表的长度
    autoplay: true,
    interval: 3000,
    duration: 2000,
    duration: 500,
    current: 0,
    swiperIndex: 0,
  },
  turnmsg:function(e){
    // console.log(e.currentTarget.dataset.id)
    let theTurnID = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './../details/details?id='+theTurnID
    })
  },
  indexChange(e) {
    var that = this;
    that.setData({
      current: e.detail.current
    })
  },
  swiperChange(e) {
    const that = this;
    that.setData({
    swiperIndex: e.detail.current,
    })
  },
  getDate:function(){
    const countResult =  db.collection('CATEGORY').count()
    var thelist = [];
    var prelist = this.data.classList;
    db.collection('CATEGORY').get().then((res)=>{
      thelist = res.data
      thelist = thelist.filter(l=>{return l.name!='猜你喜欢'})
      // console.log(thelist)
      var tlength = this.data.classList.length;
      for(var i = 0;i<thelist.length;i++){
        let params = {id:String(tlength+i),title: thelist[i].name,imgurl: thelist[i].pic}
        prelist.push(params)
        // console.log(prelist)
      }
      this.setData({
        classList:prelist
      })
    })
  },
  getSwiperGoods(){
    app.globalData.db.collection('goods').where({
      catgory:{								//columnName表示欲模糊查询数据所在列的名
        $regex:'.*' + "0" + '.*',		//queryContent表示欲查询的内容，‘.*’等同于SQL中的‘%’
        $options: 'i'							//$options:'1' 代表这个like的条件不区分大小写,详见开发文档
      }
    }).get().then((res)=>{
      console.log(res)
      this.setData({
        imgInfoArr:res.data
      })
    })
  },
  fruitClassify:function(e){
    console.log(e.currentTarget.dataset.id)
    let turnid = e.currentTarget.dataset.id
    wx.reLaunch({
      url: './../commodity/commodity?id='+turnid,
    })
  },
  jumpSearchGood(){
    wx.navigateTo({
      url: '../newSearch/newSearch'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDate();
    this.getSwiperGoods();
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