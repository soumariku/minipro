var app = getApp()
Page( {
  data: {
    /**
        * 页面配置
        */
    winWidth: 0,
    winHeight: 0,
    // tab切换
    currentTab: 0,
    // years:'2020',
    // months:'04'
  },
  onLoad: function() {
    var that = this;
    var date = new Date();
    var nowyears = date.getFullYear(); //获取完整的年份(4位)
    var nowmonths = date.getMonth()+1;
    nowmonths = nowmonths<10?'0'+nowmonths:nowmonths
    var startDate = String(nowyears-3)+'-'+String(nowmonths)
    var endDate = String(nowyears)+'-'+String(nowmonths)
    var serachDate = String(nowyears)+'/'+String(nowmonths)
    this.setData({
      years:nowyears,
      months:nowmonths,
      startDate:startDate,
      endDate:endDate,
      serachDate:serachDate
    })
    /**
     * 获取系统信息
     */
    this.getOrders()
    this.getMonthOrders()
    wx.getSystemInfo( {
 
      success: function( res ) {
        console.log(res.windowWidth)
        that.setData( {
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
 
    });
  },
  getMonthOrders(){
    app.globalData.db.collection('orders')
      .where({
        orderTime:{								//columnName表示欲模糊查询数据所在列的名
          $regex:'.*' + this.data.serachDate + '.*',		//queryContent表示欲查询的内容，‘.*’等同于SQL中的‘%’
          $options: 'i'							//$options:'1' 代表这个like的条件不区分大小写,详见开发文档
        }
      })
      .get().then((res)=>{
      console.log(res.data)
      let ordernum = res.data.length
      let monthget = 0
      let monthprofit = 0
      for(var i=0;i<res.data.length;i++){
        monthget = Number(monthget)+Number(res.data[i].sumprice)
        if(!!res.data[i].profitPrice){
          monthprofit = Number(monthprofit)+Number(res.data[i].profitPrice)
        }
      }
      this.setData({
        ordernum:ordernum,
        monthget:monthget,
        monthprofit:monthprofit
      })
    })
  },
  getOrders(){
    this.setData({
      ordersList:[]
    })
    wx.cloud.callFunction({
      name: "searchAllData",
      data: {
        collection: 'orders',
        order:'orderTime',
        condition:{orderState:"C"}
      }
    }).then(res => {
      var theheight = res.result.data.length*230
      console.log(res)
      for(var i=0;i<res.result.data.length;i++){
        //状态：A-预约配送、B-商品自取、C-订单完成
        if(res.result.data[i].orderState == 'A'){
          res.result.data[i].orderState = '预约配送'
        }else if(res.result.data[i].orderState == 'B'){
          res.result.data[i].orderState = '商品自取'
        }else{
          res.result.data[i].orderState = '订单完成'
        }
      }
      this.setData({
        winWidth: theheight,
        ordersList:res.result.data
      })
    }).catch(res => {
      console.log("推送消息失败", res)
    })
  },
  toOrderDetail(e){
    console.log(e)
    wx.navigateTo({
      url: './../orderdetail/orderdetail?id='+e.currentTarget.dataset.id,
    })
  },
  getDateTime(e){
    var obj = e.detail.value
    console.log(obj)
    var index=obj.lastIndexOf("\-");
    var years=obj.substring(0,index);
    var months=obj.substring(index+1,obj.length);
    var newDate = years+'/'+months
    this.setData({
      years:years,
      months:months,
      serachDate:newDate
    })
    this.getMonthOrders()
    console.log(e)
  },
  /**
     * 滑动切换tab
     */
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
  }
})
