const db = wx.cloud.database({
  //这个是环境ID不是环境名称
  env:'zilaipifabu-ptg4d'
})
const MAX_LIMIT = 2
const app = getApp()
const API = require('../../utils/API.js')
Page({
  onLoad:function(option){
    this.getDate();
    if(option.id==null){
      this.getgoods('0');
    }else{
      this.getgoods(option.id);
    }    
    // this.setData({
    //   id:option.id
    // })
  },
  data:{
    pres: [],
    goods:[],
    id: 0,
  },
  getDate:function(){
    const countResult =  db.collection('CATEGORY').count()
    var thelist = [];
    var prelist = this.data.pres;
    db.collection('CATEGORY').get().then((res)=>{
      thelist = res.data
      thelist = thelist.filter(l=>{return l.name!='猜你喜欢'})
      // console.log(thelist)
      var tlength = this.data.pres.length;
      for(var i = 0;i<thelist.length;i++){
        let params = {id:thelist[i]._id,preX: thelist[i].name}
        // let params = {id:String(tlength+i),preX: thelist[i].name}
        prelist.push(params)
        // console.log(prelist)
      }
      this.setData({
        pres:prelist
      })
    })
  },
  getgoods:function(e){
    wx.showLoading({
      title: '',
    })
    var ids = "";
    if(!e.currentTarget){
      // ids = e
      ids = ''
    }else{
      ids = e.currentTarget.dataset.id;
    }
    // console.log(ids.length)
    // let newstr = String(Number(ids)+1)
    // for(var i=0;i<(3-newstr.length);i++){
    //   newstr = '0'+newstr
    // }
    // console.log(newstr)
    console.log('ids',ids);
    var good = "";
    wx.cloud.callFunction({
      name: "searchData",
      data: {
        collection:'goods',
        data:{
          catgory:{								//columnName表示欲模糊查询数据所在列的名
            $regex:'.*' + ids + '.*',		//queryContent表示欲查询的内容，‘.*’等同于SQL中的‘%’
            $options: 'i'							//$options:'1' 代表这个like的条件不区分大小写,详见开发文档
          }
        }
      }
    }).then((res)=>{
      good = res.result.data
      console.log(good)
      for(var i=0;i<good.length;i++){
        let thenum = Number(good[i].priceList.length)-1
        let nowprice = good[i].priceList[thenum].price
        let preprice = good[i].priceList[0].price
        if(!!app.globalData.hasLogin){
          good[i].nowprice=nowprice
          good[i].preprice=preprice
        }else{
          good[i].nowprice='--'
          good[i].preprice='--'
        }
      }
      // console.log(res)
      this.setData({
        id: ids,  //把获取的自定义id赋给当前组件的id(即获取当前组件)  
        goods: good
      })
      wx.hideLoading()
    }) 
    // db.collection('goods').where({
    //   catgory:{								//columnName表示欲模糊查询数据所在列的名
    //     $regex:'.*' + newstr + '.*',		//queryContent表示欲查询的内容，‘.*’等同于SQL中的‘%’
    //     $options: 'i'							//$options:'1' 代表这个like的条件不区分大小写,详见开发文档
    //   }
    // }).get().then((res)=>{
    //   good = res.data
    //   // console.log(res)
    //   this.setData({
    //     id: ids,  //把获取的自定义id赋给当前组件的id(即获取当前组件)  
    //     goods: good
    //   })
    // })
  },
  turnmsg:function(e){
    // console.log(e.currentTarget.dataset.id)
    let theTurnID = e.currentTarget.dataset.id;
    if(!!app.globalData.hasLogin){
      wx.navigateTo({
        url: './../details/details?id='+theTurnID
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '尚未登录，登录方可查看详情',
        confirmText:'确定',
        cancelText:'取消',
        cancelColor:'#D6463C',
        success: function(res){
          if(res.confirm){
            wx.navigateTo({
              url: './../index/index'
            })
          }
        }
      })
    }
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
})
