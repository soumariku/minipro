// pages/administrator/administrator.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:false,
    category:false,
    gooods:false,
    orders:false,
    begin:true,
    email_nums:0,
    currentTab: 0,
    adminname:'',
    adminpassword:'',
    selectShow: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: ['所有订单','确认收货订单','未确认收货订单'],//下拉列表的数据
    index: 0,//选择的下拉列表下标
  },
  selectTap() {
    this.setData({
      selectShow: !this.data.selectShow
    });
  },
  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    console.log(e)
    this.getOrders(Index)
    this.setData({
      index: Index,
      selectShow: !this.data.selectShow,
      email_nums:0
    });
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
  adminNameInput(e){
    console.log(e.detail.value)
    this.setData({
      adminName:e.detail.value
    })
  },
  adminPasswordInput(e){
    console.log(e.detail.value)
    this.setData({
      adminPassword:e.detail.value
    })
  },
  adminChange(){
    let id = ''
    let _this = this
    if(!!_this.data.adminName&&!!_this.data.adminPassword){
      app.globalData.db.collection('user').where({role:'administrator'}).get().then((res)=>{
        console.log(res)
        id = res.data[0]._id
      wx.cloud.callFunction({
        name: "updateData",
        data: {
          id:id,
          collection:'user',
          data:{
            name:_this.data.adminName,
            password:_this.data.adminPassword
          }
        }
      }).then((res)=>{
        console.log(res)
          wx.showToast({
            title: '已完成！',
            icon: 'success',
            duration: 3000
          });
      })
    })
    }else{
      wx.showLoading({
        title: '密码或账号为空',
        icon: 'none',
        image:'../../icon/close.png',
        duration: 2000
      })
    }
  },
  userNameInput(e){
    console.log(e.detail.value)
    this.setData({
      userName:e.detail.value
    })
  },
  userPasswordInput(e){
    console.log(e.detail.value)
    this.setData({
      userPassword:e.detail.value
    })
  },
  userChange(){
    let id = ''
    let _this = this
    if(!!_this.data.userName&&!!_this.data.userPassword){
      app.globalData.db.collection('user').where({role:'user'}).get().then((res)=>{
        console.log(res)
        id = res.data[0]._id
      wx.cloud.callFunction({
        name: "updateData",
        data: {
          id:id,
          collection:'user',
          data:{
            name:_this.data.userName,
            password:_this.data.userPassword
          }
        }
      }).then((res)=>{
        console.log(res)
          wx.showToast({
            title: '已完成！',
            icon: 'success',
            duration: 3000
          });
      })
    })
    }else{
      wx.showLoading({
        title: '密码或账号为空',
        icon: 'none',
        image:'../../icon/close.png',
        duration: 2000
      })
    }
  },
  updateUser(){
    this.setData({
      user:true,
      begin:false
    })
    app.globalData.db.collection('CATEGORY').get().then((res)=>{
      console.log(res.data)
      this.setData({
        catagoryList:res.data
      })
    })
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
  getOrders(index){
    this.setData({
      orders:true,
      begin:false,
      email_nums:0,
      ordersList:[]
    })
    let searchindex = {}
    const _ =  app.globalData.db.command
    if(index == 0||index.type=='tap'){
      searchindex = {}
    }else if(index == 1){
      searchindex = {orderState : "C"}
    }else{
      searchindex = {orderState : _.in(['A', 'B'])}
    }
    app.globalData.db.collection('orders').where(searchindex).orderBy('orderState', 'asc').orderBy('orderTime', 'desc').get().then((res)=>{
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
  getpal(){
    wx.navigateTo({
      url: '../profitAndLoss/profitAndLoss',
    })
  },
  onReachBottom: function () {
    if(this.data.orders == true){
      let searchindex = {}
      if(this.data.index == 0){
        searchindex = {}
      }else if(this.data.index == 1){
        searchindex = {orderState : "C"}
      }else{
        searchindex = {orderState : _.in(['A', 'B'])}
      }  
    console.log('YES')
    wx.showLoading({
      title: '刷新中！',
      duration: 1000
    })
    console.log(searchindex)
    let x = this.data.email_nums + 20
    console.log(x)
    let old_data = this.data.email
    app.globalData.db.collection('orders').where(searchindex).orderBy('orderTime', 'desc').skip(x) // 限制返回数量为 20 条
      .get()
      .then(res => {
      //  // 这里是从数据库获取文字进行转换 变换显示（换行符转换） 
      //   res.data.forEach((item, i) => {
      //     res.data[i].content = res.data[i].content.split('*hy*').join('\n');
      //   })
      let newlist = this.data.ordersList
      for(var i=0;i<res.data.length;i++){
        //状态：A-预约配送、B-商品自取、C-订单完成
        if(res.data[i].orderState == 'A'){
          res.data[i].orderState = '预约配送'
        }else if(res.data[i].orderState == 'B'){
          res.data[i].orderState = '商品自取'
        }else{
          res.data[i].orderState = '订单完成'
        }
        newlist.push(res.data[i])
      }
      // 利用concat函数连接新数据与旧数据
      // 并更新emial_nums  
        this.setData({
          email: newlist,
          email_nums: x
        })
        console.log(res.data)
      })
      .catch(err => {
        console.error(err)
      })
    console.log('circle 下一页');
  }
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
          wx.cloud.callFunction({
            name: "updateData",
            data: {
              id:id,
              collection:'orders',
              data:{
                orderState:'C'
              }
            }
          }).then((res)=>{
            console.log(res)
              wx.showToast({
                title: '已完成！',
                icon: 'success',
                duration: 3000
              });
              _this.getOrders(this.data.Index)
          })
          // app.globalData.db.collection('orders').doc(id).update({
          //   data:{
          //     orderState:'C'
          //   },
          //   success: function(res) {
          //     console.log(res)
          //     wx.showToast({
          //       title: '已完成！',
          //       icon: 'success',
          //       duration: 3000
          //     });
          //     _this.getOrders()
          //   }
          // })
        }
      }
    })
    
  },
  bindFormSubmit: function(e) {
    console.log(e)
  },
  toUpdateCategory(e){
    wx.navigateTo({
      url: './../updatecategory/updatecategory?id='+e.currentTarget.dataset.id,
    })
  },
  toUpdateGoods(e){
    wx.navigateTo({
      url: './../updateGoods/updateGoods?id='+e.currentTarget.dataset.id,
    })
  },
  toOrderDetail(e){
    console.log(e)
    wx.navigateTo({
      url: './../orderdetail/orderdetail?id='+e.currentTarget.dataset.id,
    })
  },
  bindChange: function( e ) {
 
    var that = this;
    that.setData( { currentTab: e.detail.current });
 
  },
  /**
   * 点击tab切换
   */
  swichNav: function( e ) {
 
    var that = this;
 
    if( this.data.currentTab === e.target.dataset.current ) {
      return false;
    } else {
      that.setData( {
        currentTab: e.target.dataset.current
      })
    }
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
  

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})