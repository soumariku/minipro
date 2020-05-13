const API = require('../../utils/API.js');
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orders: [],//用来接收接口返回数据
    goods:[],
    sumprice:'',
    index:0,
    dialogShow:false,
    buttons: [{text: '取消'}, {text: '确定'}],
    selectData: ['预约送货','商品自取'],//下拉列表的数据
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id:options.id
    })
    this.getOrders(options.id)
  },
  selectTap() {
    this.setData({
      selectShow: !this.data.selectShow
    });
  },
  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    let destate = ''
    if(Index == 0){
      destate = 'A'
    }else{
      destate = 'B'
    }
    this.setData({
      index: Index,
      selectShow: !this.data.selectShow,
      destate:destate
    });
  },
  remarkchange(e){
    this.setData({
      newremark:e.detail.value
    })
  },
  tapDialogButton(e){
    let _this = this
    console.log(e)
    if(e.detail.item.text == '确定'){
      wx.showLoading({
        title: '',
       })
       let sendmsg = ''
       let goodslist = _this.data.goodslist
       for(var i=0;i<goodslist.length;i++){
         let sumprice = (Number(goodslist[i].price)*Number(goodslist[i].count)).toFixed(2);
        sendmsg = sendmsg+String(i+1)+'、'+goodslist[i].name+'\t'+goodslist[i].flavor+'\n数量：'+goodslist[i].count+'\t'+goodslist[i].levelname+String(goodslist[i].price)+'\t总价：'+String(sumprice)+'\n'
       }
       let orders = _this.data.orders[0]
      console.log(_this.data.destate)
      let type = ''
      if(_this.data.destate=='B'){
        type = '配送类型：'+_this.data.orderState+'\n'
        _this.setData({
          newremark:''
        })
      }else{
        type = '预约送货：'+_this.data.newremark+'\n'
      }
      let selfsendmsg = '客户：'+orders.buyer+'\n下单时间：'+orders.orderTime+'\n联系方式：'+orders.telephone+'\n地址：'+orders.location+'\n'+type+sendmsg +'应收：'+orders.sumprice
      wx.cloud.callFunction({
        name: "updateData",
        data: {
          id:_this.data.id,
          collection:'orders',
          data:{
            orderState:_this.data.destate,
            remarks:_this.data.newremark,
            sendmsg:selfsendmsg
          }
        }
      }).then((res)=>{
        console.log(res)
        wx.hideLoading()
        wx.showToast({
          title: '更改完成！',
          icon: 'success',
          duration: 3000
        });
        this.getOrders(_this.data.id)
      })
    }else{
      console.log('按了取消')
    }
    this.setData({
      dialogShow: false
    })
  },
  getOrders(id){
    app.globalData.db.collection('orders').where({
      _id:id
    }).get().then((res)=>{
      console.log(res)
      let showmsg = []
      let state = false
      let Index = 0
      let destate = ''
      for(var i=0;i<res.data.length;i++){
        //状态：A-预约配送、B-商品自取、C-订单完成
        if(res.data[i].orderState == 'A'){
          res.data[i].orderState = '预约配送'
          destate = 'A'
          Index = 0
        }else if(res.data[i].orderState == 'B'){
          res.data[i].orderState = '商品自取'
          destate = 'B'
          Index = 1
        }else{
          res.data[i].orderState = '订单完成'
          destate = 'C'
          state = true
        }
      }
      let gmsg = res.data[0].goodsmsg
      let pmsg = res.data[0].goodspic
      for(var i=0;i<gmsg.length;i++){
        let goodsmsg = {msg:gmsg[i],pic:pmsg[i]}
        showmsg.push(goodsmsg)
      }
      this.setData({
        orders:res.data,
        goods:showmsg,
        isComplete:state,
        goodslist:res.data[0].goodslist,
        orderState:res.data[0].orderState,
        sumprice:res.data[0].sumprice,
        remarks:res.data[0].remarks,
        orderTime:res.data[0].orderTime,
        sendmsg:res.data[0].sendmsg,
        orderId:res.data[0]._id,
        newremark:res.data[0].remarks,
        index:Index,
        destate:destate
      })
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
    console.log('2')
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
  updateCompleteState(){
    let id = this.data.id
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
          // app.globalData.db.collection('orders').doc(id).update({
          //   data:{
          //     orderState:'C'
          //   },
          //   success: function(res) {
          //     wx.navigateBack({
          //       delta: 1,  // 返回上一级页面。
          //       success: function() {
          //         wx.showToast({
          //           title: '已完成！',
          //           icon: 'success',
          //           duration: 3000
          //         });
          //       }
          //     })
          //   }
          // })
        }
      }
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
  changedelivery(){
    this.setData({
      dialogShow:true
    })
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
  }
})