// pages/shopcar/shopcar.js
const API = require('../../utils/API.js');
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carisShow: false, //购物车是否有商品
    isChecked: true, //全选状态设置
    isEdit: true, //是否编辑状态
    isSettlementRed: true, //红色结算按钮状态
    isSettlement: false, //红色结算按钮状态
    idDeteleRed: false, //红色删除按钮
    idDetel: false, //灰色删除按钮
    isSelect: false, //是否为编辑状态
    goodsCar: [],//用来接收接口返回数据
    buttons: [{text: '取消'}, {text: '确定'}],
    dialogShow: false,
    remarks:'',
    col1:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },
  //获取猜你喜欢列表
  getlikegoods(){
    app.globalData.db.collection('goods').where({
      catgory:{								//columnName表示欲模糊查询数据所在列的名
        $regex:'.*' + '008' + '.*',		//queryContent表示欲查询的内容，‘.*’等同于SQL中的‘%’
        $options: 'i'							//$options:'1' 代表这个like的条件不区分大小写,详见开发文档
      }
  }).get().then((res)=>{

      this.setData({
        col1:res.data
      })
    })
  },
  // 编辑事件
  editGood: function() {
    this.setData({
      isEdit: false,
      isSelect: true,
      isSettlementRed: false,
      isSettlement: false,
      idDeteleRed: true,
      idDetel: false
    });
  },
  // 完成事件
  editComplete: function() {
    this.setData({
      isEdit: true,
      isSelect: false,
      isSettlementRed: true,
      isSettlement: false,
      idDeteleRed: false,
      idDetel: false
    });
  },
  // 全选事件
  checkSelectAll :function(){
    let isChecked = this.data.isChecked; //获取全选状态
    let isSettlementRed = this.data.isSettlementRed; //获取红色结算按钮的状态
    let isSettlement = this.data.isSettlement; //获取灰色结算按钮的状态
    let idDeteleRed = this.data.idDeteleRed; //获取红色结算按钮的状态
    let idDetel = this.data.idDetel; //获取灰色结算按钮的状态
    let isEdit = this.data.isEdit;
    isChecked = !isChecked;
    isSettlementRed = !isSettlementRed;
    isSettlement = !isSettlement;
    idDeteleRed = !idDeteleRed;
    idDetel = !idDetel;
    let list = this.data.goodsCar;
    if(this.data.isChecked){
      for (let i = 0; i < list.length; i++) {
        list[i].selected = isChecked;
        // 判断是否全选中
        if (list[i].selected) {
          console.log(1)
          this.data.isChecked = false;
          isSettlementRed = true;
          isSettlement = false;
          idDeteleRed = false;
          idDetel = true;
        }
      }
      if(!isEdit){
        this.setData({
          isChecked: isChecked,
          goodsCar: list,
          isSettlementRed : false,
          isSettlement : false,
          idDeteleRed: idDeteleRed,
          idDetel: idDetel
        })
      }else{
        console.log('非编辑');
        this.setData({
          isChecked: isChecked,
          goodsCar: list,
          isSettlementRed : isSettlementRed,
          isSettlement : isSettlement,
          idDeteleRed: false,
          idDetel: false
        })
      }
    }else{
      // 设置全选状态
      for (let i = 0; i < list.length; i++) {
        list[i].selected = isChecked;
        // 判断是否全选中
        if (list[i].selected) {
          console.log(1)
          this.data.isChecked = false;
          isSettlementRed = true;
          isSettlement = false;
          idDeteleRed = true;
          idDetel = false;
        }
      }
      if(!isEdit){
        this.setData({
          isChecked: isChecked,
          goodsCar: list,
          isSettlementRed : false,
          isSettlement : false,
          idDeteleRed: idDeteleRed,
          idDetel: idDetel
        })
      }else{
        console.log('非编辑');
        this.setData({
          isChecked: isChecked,
          goodsCar: list,
          isSettlementRed : isSettlementRed,
          isSettlement : isSettlement,
          idDeteleRed: false,
          idDetel: false
        })
      }
    }

    this.totalPrice();
  },
  checkAll: function() {
    let isChecked = this.data.isChecked; //获取全选状态
    let isSettlementRed = this.data.isSettlementRed; //获取红色结算按钮的状态
    let isSettlement = this.data.isSettlement; //获取灰色结算按钮的状态
    isChecked = !isChecked;
    isSettlementRed = !isSettlementRed;
    isSettlement = !isSettlement;
    let list = this.data.goodsCar;
    if(this.data.isSelect){
      // 设置全选状态
      for (let i = 0; i < list.length; i++) {
        list[i].selected = isChecked;
        // 判断是否全选中
        if (list[i].selected) {
          console.log(1)
          this.data.isChecked = false;
          // isSettlementRed = false;
          // isSettlement = false;
        }
      }
      this.setData({
        isChecked: isChecked,
        goodsCar: list,
        isSettlementRed: isSettlementRed, //隐藏红色结算
        isSettlement: isSettlement, //显示灰色结算
        idDeteleRed: true,
        idDetel: false
      });
    }else{
      // 设置全选状态
      for (let i = 0; i < list.length; i++) {
        list[i].selected = isChecked;
        // 判断是否全选中
        if (list[i].selected) {
          console.log(1)
          this.data.isChecked = false;
          isSettlementRed = true;
          isSettlement = false;
        }
      }
      this.setData({
        isChecked: isChecked,
        goodsCar: list,
        isSettlementRed: isSettlementRed, //隐藏红色结算
        isSettlement: isSettlement, //显示灰色结算
        idDeteleRed: false,
        idDetel: false
      });
    }
    
    this.totalPrice();
  },
  //单选事件
  selectShop: function(e) {
    let _this = this;
    // 获取当前选项的索引
    let index = e.currentTarget.dataset.index;
    // 获取商品列表
    let list = this.data.goodsCar;
    // 默认全选
    this.data.isChecked = true;
    // 操作当前选项
    list[index].selected = !list[index].selected;
    var isUncheck = true;
    // 当前为删除操作状态时
    if (this.data.isSelect){
      for (var i = list.length - 1; i >= 0; i--) {
        // 判断是否全选中
        if (!list[i].selected) {
          this.data.isChecked = false;
        }
        //判断是否全没选
        else if (list[i].selected) {
          isUncheck = false;
        }        
      }
      this.setData({
        goodsCar: list,
        isChecked: false,
        isSettlement: false,
        isSettlementRed: false,
        idDeteleRed: !isUncheck,
        idDetel: isUncheck
      })
    }else{
      for (var i = list.length - 1; i >= 0; i--) {
        // 判断是否全选中
        if (!list[i].selected) {
          this.data.isChecked = false;
        }
        //判断是否全没选
        else if (list[i].selected) {
          this.data.isSettlementRed = true; //红色结算按钮状态
          this.data.isSettlement = false; //灰色结算按钮状态
          this.data.idDeteleRed = false; //红色删除按钮
          this.data.idDetel = false; //灰色删除按钮
          isUncheck = false;
        }
      }
      // 重新渲染数据
      this.setData({
        goodsCar: list,
        isChecked: this.data.isChecked,
        isSettlement: isUncheck,
        isSettlementRed: !isUncheck
      })      
    }
    this.totalPrice();
  },
  //减少数量
  subNum: function(e) {
    //获取规则
    let rule = [];
    // 获取点击的索引
    const index = e.currentTarget.dataset.index;
    // 获取商品数据
    let list = this.data.goodsCar;
    // 获取商品数量
    let num = list[index].count;
    // 获取当前商品单价
    let newprice = list[index].npriceGood;
    app.globalData.db.collection('rule').where({
      goodsid: e.currentTarget.dataset.id
    }).get().then((res) => {
      rule = res.data
      console.log(rule)
      // 点击递减
      if (num <= 1) {
        this.deteleGood(e)
      } else {
        num = num - 1;
      }
      let samegoods = API.orderinfo.filter(s=>{return s.nameGood==list[index].nameGood})
      let samegoodsnum = 0;
      for(var k=0;k<samegoods.length;k++){
        samegoodsnum = Number(samegoodsnum)+Number(samegoods[k].count)
      }
      samegoodsnum = samegoodsnum+-1
      //根据规则改变价格
      console.log(rule)
      for(var i=0;i<rule.length;i++){
        if (Number(rule[i].maxnum)!=0){
          if (Number(rule[i].minnum) <= Number(samegoodsnum)){
            if (Number(samegoodsnum)<=Number(rule[i].maxnum)){
              newprice = rule[i].price
              console.log(newprice)
              break;
            }
          }
        }else{
          newprice = rule[i].price
          // console.log(newprice)
          break;
        }
      }
      for(var i =0;i<list.length;i++){
        if(list[i].nameGood == list[index].nameGood){
          list[i].npriceGood = newprice
        }
      }
      list[index].count = num;
      // list[index].npriceGood = newprice;
      // console.log(list);
      // 重新渲染 ---显示新的数量
      this.setData({
        goodsCar: list
      });
      this.totalPrice();
    })
  },
  //增加数量
  addNum: function(e) {
    //获取规则
    let rule = [];
    // 获取点击的索引
    const index = e.currentTarget.dataset.index;
    // 获取商品数据
    let list = this.data.goodsCar;
    // 获取商品数量
    let num = list[index].count;
    // 获取当前商品单价
    let newprice = list[index].npriceGood;
    app.globalData.db.collection('rule').where({
      goodsid: e.currentTarget.dataset.id
    }).get().then((res) => {
      rule = res.data
      console.log(rule)
      // 点击递增
      if(num<0){
        
      }else{
        num = num + 1;
      }
      let samegoods = API.orderinfo.filter(s=>{return s.nameGood==list[index].nameGood})
      let samegoodsnum = 0;
      for(var k=0;k<samegoods.length;k++){
        samegoodsnum = Number(samegoodsnum)+Number(samegoods[k].count)
      }
      samegoodsnum = samegoodsnum+1
    //根据规则改变价格
    // console.log(rule[1])
    for(var i=0;i<rule.length;i++){
      if (Number(rule[i].maxnum)!=0){
        if (Number(rule[i].minnum) <= Number(samegoodsnum)){
          if (Number(samegoodsnum)<=Number(rule[i].maxnum)){
            newprice = rule[i].price
            // console.log(newprice)
            break;
          }
        }
      }else{
        newprice = rule[i].price
        // console.log(newprice)
        break;
      }
    }
    for(var i =0;i<list.length;i++){
      if(list[i].nameGood == list[index].nameGood){
        list[i].npriceGood = newprice
      }
    }
    list[index].count = num;
    // list[index].npriceGood = newprice;
    // console.log(list);
    // 重新渲染 ---显示新的数量
    this.setData({
      goodsCar: list
    });
    this.totalPrice();
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
  // 批量删除
  deteleMore: function() {
    var _this = this;
    let list = this.data.goodsCar;
    wx.showModal({
      title: '提示',
      content: '确认删除这些商品吗',
      success: function(res) {
        if (res.confirm) {
          for (let i = list.length-1; i >= 0; i--) {
            if (list[i].selected) {
              list.splice(i, 1);
              _this.setData({
                goodsCar: list
              });
              // 如果数据为空
              if (!list.length) {
                _this.setData({
                  carisShow: true
                });
                wx.hideTabBarRedDot({
                  index: 2,
                })
              } else {
                // 调用金额渲染数据
                _this.totalPrice();
                wx.setTabBarBadge({
                  index: 2,
                  text: String(list.length)
                })
              }
            } else {
              console.log(res);
            }
          }
        }
      }
    })
    this.checklist()
  },
  //删除单个商品
  deteleGood: function(e) {
    var that = this;
    // 获取索引
    const index = e.currentTarget.dataset.index;
    // 获取商品列表数据
    let list = this.data.goodsCar;
    let rule = [];
    wx.showModal({
      title: '提示',
      content: '确认删除吗',
      success: function(res) {
        if (res.confirm) {
          app.globalData.db.collection('rule').where({
            goodsid: e.currentTarget.dataset.id
          }).get().then((res) => {
            rule = res.data
            let deletename = list[index].nameGood
            let newprice = 0
            // 删除索引从1
            list.splice(index, 1);
            let samegoodsnum = 0
            for(var k=0;k<list.length;k++){
              if(deletename==list[k].nameGood){
                samegoodsnum = Number(samegoodsnum)+Number(list[k].count)
              }
            }
            for(var i=0;i<rule.length;i++){
              if (Number(rule[i].maxnum)!=0){
                if (Number(rule[i].minnum) <= Number(samegoodsnum)){
                  if (Number(samegoodsnum)<=Number(rule[i].maxnum)){
                    newprice = rule[i].price
                    // console.log(newprice)
                    break;
                  }
                }
              }else{
                newprice = rule[i].price
                // console.log(newprice)
                break;
              }
            }
            for(var i =0;i<list.length;i++){
              if(list[i].nameGood == deletename){
                list[i].npriceGood = newprice
              }
            }
            // 页面渲染数据
            that.setData({
              goodsCar: list
            });
            // 如果数据为空
            if (!list.length) {
              that.setData({
                carisShow: true
              });
              wx.hideTabBarRedDot({
                index: 2,
              })
            } else {
              // 调用金额渲染数据
              that.totalPrice();
              wx.setTabBarBadge({
                index: 2,
                text: String(list.length)
              })
            }
        })
        } else {
          console.log(res);
        }
        
      },
      fail: function(res) {
        console.log(res);
      }
    })
  },
  checklist(){
    if (API.orderinfo.length>0) {
      this.setData({
        carisShow: false
      });
      wx.setTabBarBadge({
        index: 2,
        text: String(API.orderinfo.length)
      })
    }else{
      this.setData({
        carisShow: true
      });
      wx.hideTabBarRedDot({
        index: 2,
      })
    }
  },
  // 结算生成订单
  goOrder:function(){
    let _this = this;
    let list = _this.data.goodsCar;
    let nlist = [];
    let piclist = [];
    let goodslist = [];
    let time = util.formatTime(new Date())
    let profitPrice = 0
    let sendmsg = ''
    // 携带订单信息生成订单
    for(let i=0;i<list.length;i++){
      if(list[i].selected){
        let goodsmsg = ''
        let pic = list[i].imgGood
        let selectgood = {name:list[i].nameGood,count:list[i].count,flavor:list[i].clickflavor,price:String(list[i].npriceGood),buyingprice:Number(list[i].buyingprice),levelname:list[i].levelname,opriceGood:list[i].opriceGood}
        let sumprice = (Number(list[i].npriceGood)*Number(list[i].count)).toFixed(2);
        console.log('buyingprice',list[i].buyingprice)
        profitPrice = Number(profitPrice)+(Number(list[i].count)*Number(list[i].buyingprice))
        goodsmsg = '商品：'+list[i].nameGood+'\n口味：'+list[i].clickflavor+'\n数量：'+list[i].count+'\n'+list[i].levelname+String(list[i].npriceGood)+'\n原价：'+list[i].opriceGood+'\n总价：'+String(sumprice);
        sendmsg = sendmsg+String(i+1)+'、'+list[i].nameGood+'\t'+list[i].clickflavor+'\n数量：'+list[i].count+'\t'+list[i].levelname+String(list[i].npriceGood)+'\t总价：'+String(sumprice)+'\n'
        console.log(goodsmsg)
        nlist.push(goodsmsg);
        piclist.push(pic);
        goodslist.push(selectgood)
      }
    }
    sendmsg = '客户：'+_this.data.buyer+'\n下单时间：'+time+'\n联系方式：'+_this.data.userTel+'\n地址：'+_this.data.userAddress+'\n'+sendmsg +'应收：'+_this.data.totalPrice
    console.log(time)
    console.log(sendmsg)
    profitPrice = Number(_this.data.totalPrice)-Number(profitPrice)
    console.log('profitPrice',profitPrice)
    console.log('totalPrice',_this.data.totalPrice)
    _this.setData({
      time:time,
      realOrderMsg:nlist,
      orderPic:piclist,
      profitPrice:profitPrice,
      sendmsg:sendmsg,
      goodslist:goodslist
    })
    //状态：A-预约配送、B-商品自取、C-订单完成
    // console.log('A')
    wx.showModal({
      title: '提示',
      content: '选择配送方式',
      cancelText:'预约配送',
      confirmText:'商品自取',
      cancelColor:'#D6463C',
      success: function(res){
        if(res.confirm){
          app.globalData.db.collection('orders').add({
            data: {
              buyer: _this.data.buyer,
              orderTime: time,
              orderState:'B',
              goodsmsg: nlist,
              goodspic:piclist,
              location: _this.data.userAddress,
              telephone:_this.data.userTel,
              sumprice:_this.data.totalPrice,
              profitPrice:_this.data.profitPrice,
              remarks:'',
              sendmsg:sendmsg,
              goodslist:goodslist
            }
          }).then((res)=>{
            app.sendmsg(_this.data.sendmsg)
            API.orderinfo =[]
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 3000
            });
            
            _this.checklist()
          })
        }else{
          _this.setData({
              dialogShow: true
          })
        }
      }
    })
  },
  //获取用户地址和联系方式
  getUserMsg(){
    app.globalData.db.collection('customer').where({
      name:app.globalData.userInfo.nickName
    }).get().then((res)=>{
      if(res.data.length>0){
        if(!!res.data[0].telephone&&!!res.data[0].address&&!!res.data[0].truename){
          this.setData({
            userTel:res.data[0].telephone,
            userAddress:res.data[0].address,
            buyer:res.data[0].truename
          })
        }else{
          wx.showModal({
            title: '提示',
            content: '请先添加您的联系方式和地址',
            confirmText:'确定',
            cancelText:'取消',
            cancelColor:'#D6463C',
            success: function(res){
              if(res.confirm){
                wx.switchTab({
                  url: './../my/my'
                })
              }else{
                wx.switchTab({
                  url: './../commodity/commodity'
                })
              }
            }
          })
        }
      }else{
        wx.showModal({
          title: '提示',
          content: '请先添加您的联系方式和地址',
          confirmText:'确定',
          cancelText:'取消',
          cancelColor:'#D6463C',
          success: function(res){
            if(res.confirm){
              wx.switchTab({
                url: './../my/my'
              })
            }else{
              wx.switchTab({
                url: './../commodity/commodity'
              })
            }
          }
        })
      }
    })
  },
  tocommodity(){
    wx.switchTab({
      url: '../commodity/commodity'   
    })
  },
  turnmsg:function(e){
    // console.log(e.currentTarget.dataset.id)
    let theTurnID = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './../details/details?id='+theTurnID
    })
  },
  tapDialogButton(e){
    let _this = this
    if(e.detail.item.text = '确定'){
      let newsendmsg = _this.data.sendmsg+'\n预约送货：'+_this.data.remarks
      app.globalData.db.collection('orders').add({
        data: {
          buyer: _this.data.buyer,
          orderTime: _this.data.time,
          orderState:'A',
          goodsmsg: _this.data.realOrderMsg,
          goodspic: _this.data.orderPic,
          location: _this.data.userAddress,
          telephone: _this.data.userTel,
          sumprice: _this.data.totalPrice,
          profitPrice:_this.data.profitPrice,
          remarks: _this.data.remarks,
          sendmsg:newsendmsg
        }
      }).then((res)=>{
        app.sendmsg(newsendmsg)
        API.orderinfo =[]
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 3000
        });
        _this.checklist()
      })
    }
    this.setData({
      dialogShow: false
    })
  },
  getremarks(e){
    this.setData({
      remarks:e.detail.value
    })
  },
  getgoodsCar(){
    let goodsCar = API.orderinfo;
    console.log(goodsCar)
    this.setData({
      goodsCar:goodsCar
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
    this.getlikegoods();
    this.getUserMsg();
    this.getgoodsCar();
    this.checklist();
    this.totalPrice();
    // if(API.orderinfo.length>0){
    //   wx.setTabBarBadge({
    //     index: 2,
    //     text: String(API.orderinfo.length)
    //   })
    // }else{
    //   wx.removeTabBarBadge({
    //     index: 0,
    //   })
    // }
  }
})