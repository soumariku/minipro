// pages/updateOrders/updateOrders.js
const app  = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  getorders(){
    app.globalData.db.collection('orders').where({
      _id:this.data.ordersid
    }).get().then((res)=>{
      console.log(res)
      this.setData({
        orders:res.data[0],
        goodslist:res.data[0].goodslist,
        sendmsg:res.data[0].sendmsg,
        orderId:res.data[0]._id
      })
      this.totalPrice()
    })
  },
  changegoodsnum(e){
    // console.log(e)
    let _this = this
    let choosename = e.currentTarget.dataset.name
    let chooseflavor = e.currentTarget.dataset.flavor
    let choosegoodscount = 0
    let thecount = 0
    if(!!e.detail.value){
      choosegoodscount = e.detail.value
      thecount = e.detail.value
    }
    // console.log('choosegoodscount',choosegoodscount)
    app.globalData.db.collection('goods').where({
      name:choosename
    }).get().then((res)=>{
      let goodsid = res.data[0]._id
      app.globalData.db.collection('rule').where({
        goodsid:goodsid
      }).orderBy('price', 'desc').get().then((res)=>{
        let rule = res.data
        console.log(rule)
        let changegoods = _this.data.goodslist.filter(g=>{return g.name == choosename&&g.flavor==chooseflavor})
        let nochangegoods = _this.data.goodslist.filter(g=>{return g.name == choosename&&g.flavor!=chooseflavor})
        // let othersgoods = _this.data.goodslist.filter(g=>{return g.name != choosename&&g.flavor!=chooseflavor})
        // console.log('changegoods',changegoods)
        // console.log('nochangegoods',nochangegoods)
        // console.log('othersgoods',othersgoods)
        for(var i=0;i<nochangegoods.length;i++){
          choosegoodscount = Number(choosegoodscount)+Number(nochangegoods[i].count)
        }
        console.log('choosegoodscount',choosegoodscount)
        let newprice = 0
        let levelname = ''
        console.log(rule)
        for(var i=0;i<rule.length;i++){
          if (Number(rule[i].maxnum)!=0){
            if (Number(rule[i].minnum) <= Number(choosegoodscount)){
              if (Number(choosegoodscount)<=Number(rule[i].maxnum)){
                newprice = rule[i].price
                levelname = rule[i].levelname
                console.log(newprice)
                break;
              }
            }
          }else{
            newprice = rule[i].price
            levelname = rule[i].levelname
            console.log(newprice)
            break;
          }
        }
        let newlist = _this.data.goodslist
        for(var j=0;j<newlist.length;j++){
          if(newlist[j].name == choosename){
            newlist[j].price = newprice
            newlist[j].levelname = levelname
            if(newlist[j].flavor == chooseflavor){
              newlist[j].count = Number(thecount)
            }
          }
        }
        console.log('newlist',newlist)
        this.setData({
          goodslist:newlist
        })
        _this.totalPrice()
      })
    })
  },
  // 计算金额
  totalPrice: function() {
    let list = this.data.goodslist;
    let total = 0;
    // 循环列表得到每个数据
    for (let i = 0; i < list.length; i++) {
      // 所有价格加起来 count_money
      total += list[i].count * list[i].price;
    }
    // 最后赋值到data中渲染到页面
    this.setData({
      totalPrice: total.toFixed(2)
    });
  },
  //更新订单
  updateOrders(){
    let profitPrice = 0;
    let nlist = []
    let sendmsg = ''
    let _this = this
    let goodslist = _this.data.goodslist
    let id = _this.data.ordersid
    // 携带订单信息生成订单
    for(let i=0;i<goodslist.length;i++){
        let goodsmsg = ''
        let sumprice = (Number(goodslist[i].price)*Number(goodslist[i].count)).toFixed(2);
        profitPrice = Number(profitPrice)+(Number(goodslist[i].count)*Number(goodslist[i].buyingprice))
        goodsmsg = '商品：'+goodslist[i].name+'\n口味：'+goodslist[i].flavor+'\n数量：'+goodslist[i].count+'\n'+goodslist[i].levelname+String(goodslist[i].price)+'\n原价：'+goodslist[i].opriceGood+'\n总价：'+String(sumprice);
        sendmsg = sendmsg+String(i+1)+'、'+goodslist[i].name+'\t'+goodslist[i].flavor+'\n数量：'+goodslist[i].count+'\t'+goodslist[i].levelname+String(goodslist[i].price)+'\t总价：'+String(sumprice)+'\n'
        console.log(goodsmsg)
        nlist.push(goodsmsg);
    }
    if(_this.data.orders.orderState=='A'){
      sendmsg = '客户：'+_this.data.orders.buyer+'\n下单时间：'+_this.data.orders.orderTime+'\n联系方式：'+_this.data.orders.telephone+'\n地址：'+_this.data.orders.location+'\n预约送货：'+_this.data.orders.remarks+'\n'+sendmsg +'应收：'+_this.data.totalPrice
    }else{
      sendmsg = '客户：'+_this.data.orders.buyer+'\n下单时间：'+_this.data.orders.orderTime+'\n联系方式：'+_this.data.orders.telephone+'\n地址：'+_this.data.orders.location+'\n'+sendmsg +'应收：'+_this.data.totalPrice
    }
    profitPrice = Number(_this.data.totalPrice)-Number(profitPrice)
    wx.cloud.callFunction({
      name: "updateData",
      data: {
        id:id,
        collection:'orders',
        data:{
          goodslist:goodslist,
          goodsmsg:nlist,
          profitPrice:profitPrice,
          sendmsg:sendmsg,
          sumprice:_this.data.totalPrice
        }
      }
    }).then((res)=>{
      var pages = getCurrentPages(); // 当前页面
      var beforePage = pages[pages.length - 2]; // 前一个页面
      wx.navigateBack({
        // delta: 1,  // 返回上一级页面。
        complete: (res) => {
          console.log(res)
          beforePage.getOrders()
        },
      })
    })
  },
  //取消返回页面
  turnPreview(){
    wx.navigateBack({
      delta: 1,  // 返回上一级页面。
      complete: (res) => {
        console.log(res)
      },
    })
   },
   copyTBL:function(e){
    var self=this;
    wx.setClipboardData({
    data: self.data.sendmsg,
    success: function(res) {
      // self.setData({copyTip:true}),
      wx.showModal({
        title: '提示',
        content: '复制成功',
        success: function(res) {
          if (res.confirm) {
            console.log('确定')
          } else if (res.cancel) {
            console.log('取消')
          }
        }
      })
    }
  });
  },
  copyOrderId:function(){
    var self=this;
    console.log(self.data.orderId)
    wx.setClipboardData({
    data: self.data.orderId,
    success: function(res) {
      // self.setData({copyTip:true}),
      wx.showModal({
        title: '提示',
        content: '复制成功',
        success: function(res) {
          if (res.confirm) {
            console.log('确定')
          } else if (res.cancel) {
            console.log('取消')
          }
        }
      })
    }
  });
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ordersid : options.id
    })
    this.getorders()
    // this.totalPrice()
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