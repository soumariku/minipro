// pages/home/home.js
const API = require('../../utils/API.js')
const app = getApp()
const db = wx.cloud.database({
  //这个是环境ID不是环境名称
  env:'zilaipifabu-ptg4d'
})
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    imgUrl: [
      // "/icon/swiper1.jpg",//存在云里的图片，可以改成你们的地址
      // "/icon/swiper2.jpg"
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
    text: "1.【评分标准】页可以查看不同年龄段的评分标准，通过首页选择对应的性别、类别和年龄。2.【单项成绩】页包含了详细的单项打分情况及成绩雷达图，直观地看出自己的弱项和强项。",
    animation: null,
    timer: null,
    duration: 0,
    textWidth: 0,
    wrapWidth: 0,
    classList:[],
    indiicatorDots: false,
    imgInfoArrLength: '', // 轮播图列表的长度
    autoplay: true,
    interval: 3000,
    duration: 1000,
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
      // catgory:{								//columnName表示欲模糊查询数据所在列的名
      //   $regex:'.*' + "0" + '.*',		//queryContent表示欲查询的内容，‘.*’等同于SQL中的‘%’
      //   $options: 'i'							//$options:'1' 代表这个like的条件不区分大小写,详见开发文档
      // }
    }).orderBy('time', 'desc').get().then((res)=>{
      let newlist = res.data
      let downcurrent = 0
      if(res.data.length>1){
        downcurrent = 1
      }
      console.log(newlist)
      this.setData({
        imgInfoArr:newlist,
        downcurrent:downcurrent
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
  //回到顶部
  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  // 获取滚动条当前位置
  onPageScroll: function (e) {
    if (e.scrollTop > 100) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  getlikegoods(){
    wx.cloud.callFunction({
      name: "searchData",
      data: {
        collection:'goods',
        data:{
        },
        order:('time', 'desc')
      }
    }).then((res)=>{
      console.log(res)
      this.setData({
        col1:res.result.data
      })
    })
    // app.globalData.db.collection('goods').orderBy('time', 'desc').get().then((res)=>{

      
    // })
  },
  destroyTimer() {
    if (this.data.timer) {
      clearTimeout(this.data.timer);
    }
  },
  /**
  * 开启公告字幕滚动动画
  * @param  {String} text 公告内容
  * @return {[type]} 
  */
 initAnimation(text) {
   let that = this
   this.data.duration = Number(text.length)*200
   this.data.animation = wx.createAnimation({
     duration: this.data.duration,
     timingFunction: 'linear'   
   })
   let query = wx.createSelectorQuery()
   query.select('.content-box').boundingClientRect()
   query.select('#text').boundingClientRect()
   query.exec((rect) => {
     that.setData({
       wrapWidth: rect[0].width,
       textWidth: rect[1].width
     }, () => {
       this.startAnimation()
     })
   })
 },
 // 定时器动画
 startAnimation() {
   //reset
   // this.data.animation.option.transition.duration = 0
   const resetAnimation = this.data.animation.translateX(this.data.wrapWidth).step({ duration: 0 })
   this.setData({
     animationData: resetAnimation.export()
   })
   // this.data.animation.option.transition.duration = this.data.duration
   const animationData = this.data.animation.translateX(-this.data.textWidth).step({ duration: this.data.duration })
   setTimeout(() => {
     this.setData({
       animationData: animationData.export()
     })
   }, 100)
   const timer = setTimeout(() => {
     this.startAnimation()
   }, this.data.duration)
   this.setData({
     timer
   })
 },
 getHomeMsg(){
   
   app.globalData.db.collection('home').get().then((res)=>{
     let imgurl = []
    //  let count = (res.data[0].horn.length)*100
     imgurl.push(res.data[0].img1)
     imgurl.push(res.data[0].img2)
     console.log(imgurl)
     this.setData({
       text:res.data[0].horn,
      //  duration:count,
       imgUrl:imgurl
     })
     this.initAnimation(this.data.text)
    //  console.log(this.data.homeMsg)
   })
 },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDate();
    this.getSwiperGoods();
    this.setData({
      window_width: app.globalData.window_width*0.485
    })
    console.log(this.data.window_width)
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
    this.getlikegoods()
    this.getHomeMsg();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    this.destroyTimer()
    this.setData({
      timer: null
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    this.destroyTimer()
    this.setData({
      timer: null
    })
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