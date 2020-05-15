const db = wx.cloud.database({
  //这个是环境ID不是环境名称
  env:'minishop-kxw64'
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
        let params = {id:String(tlength+i),preX: thelist[i].name}
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
      ids = e
    }else{
      ids = e.currentTarget.dataset.id;
    }
    console.log(ids.length)
    let newstr = String(Number(ids)+1)
    for(var i=0;i<(3-ids.length);i++){
      newstr = '0'+newstr
    }
    console.log(newstr)
    console.log(e);
    var good = "";
    wx.cloud.callFunction({
      name: "searchData",
      data: {
        collection:'goods',
        data:{
          catgory:{								//columnName表示欲模糊查询数据所在列的名
            $regex:'.*' + newstr + '.*',		//queryContent表示欲查询的内容，‘.*’等同于SQL中的‘%’
            $options: 'i'							//$options:'1' 代表这个like的条件不区分大小写,详见开发文档
          }
        }
      }
    }).then((res)=>{
      good = res.result.data
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
    wx.navigateTo({
      url: './../details/details?id='+theTurnID
    })
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
