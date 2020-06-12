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
  getgoods:function(){
    // inputmsg = e.detail.value;
    if(!!app.globalData.hasLogin){
      const _ = app.globalData.db.command
      var good = "";
      app.globalData.db.collection('collection').where({
        collector:app.globalData.userInfo.nickName
      }).get().then((res)=>{
        console.log(res.data)
        if(res.data.length<=0){
          wx.showToast({
            title: '收藏夹没有商品',
            icon: 'none',
            image:'../../icon/close.png',
            duration: 3000
          });
        }
        let searchmsg = []
        for(var i=0;i<res.data.length;i++){
          searchmsg.push(res.data[i].goodsid)
        }
        console.log(searchmsg)
        wx.showLoading({
        title: '',
      })
      // wx.cloud.callFunction({
      //   name: "searchData",
      //   data: {
      //     collection:'goods',
      //     data:{
      //       _id: _.in(searchmsg)
      //     }
      //   }
      // }).then((res)=>{
      //   let good = res.result.data
      //     console.log(res)
      //     this.setData({
      //       //id: ids,  //把获取的自定义id赋给当前组件的id(即获取当前组件)  
      //       goods: good
      //     })
      //     wx.hideLoading()
      // }) 
        app.globalData.db.collection('goods').where({
          _id: _.in(searchmsg)
        }).get().then((res)=>{
          good = res.data
          console.log(res)
          this.setData({
            //id: ids,  //把获取的自定义id赋给当前组件的id(即获取当前组件)  
            goods: good
          })
          wx.hideLoading()
          })
        }).catch((err)=>{
          console.log(err)
        }) 
    }else{
      wx.showModal({
        title: '提示',
        content: '尚未登录，请先登录',
        confirmText:'确定',
        cancelText:'取消',
        cancelColor:'#D6463C',
        success: function(res){
          if(res.confirm){
            wx.navigateTo({
              url: './../index/index'
            })
          }else{
            wx.switchTab({
              url: './../home/home'
            })
          }
        }
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
  deletecollection(e){
    app.globalData.db.collection('collection').where({
      goodsid:e.currentTarget.dataset.id,
      collector:app.globalData.userInfo.nickName
    }).get().then((res)=>{
      let id = ''
      console.log(res)
      if(res.data.length>0){
        id = res.data[0]._id
        wx.cloud.callFunction({
          name:'deleteData',
          data: {
            id: id,
            collection:'collection'
          },
          complete: res => {
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 3000
            });
            this.getgoods()
          }
        })
      }
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getgoods()
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