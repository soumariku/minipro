const db = wx.cloud.database({
  //这个是环境ID不是环境名称
  env:'minishop-kxw64'
})
const MAX_LIMIT = 2
const app = getApp()
Page({
  onLoad:function(){
    this.getDate();
    this.getgoods('0');
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
      // console.log(thelist)
      var tlength = this.data.pres.length;
      for(var i = 0;i<thelist.length;i++){
        let params = {id:String(tlength+i),preX: thelist[i].name}
        prelist.push(params)
        console.log(prelist)
      }
      this.setData({
        pres:prelist
      })
    })
  },
  getgoods:function(e){
    var ids = "";
    if(!e.currentTarget){
      ids = e
    }else{
      ids = e.currentTarget.dataset.id;
    }
    
    console.log(e);
    var good = ""; 
    db.collection('goods').where({
      catgory:{								//columnName表示欲模糊查询数据所在列的名
        $regex:'.*' + ids + '.*',		//queryContent表示欲查询的内容，‘.*’等同于SQL中的‘%’
        $options: 'i'							//$options:'1' 代表这个like的条件不区分大小写,详见开发文档
      }
    }).get().then((res)=>{
      good = res.data
      // console.log(res)
      this.setData({
        id: ids,  //把获取的自定义id赋给当前组件的id(即获取当前组件)  
        goods: good
      })
    })
  },
  turnmsg:function(e){
    // console.log(e.currentTarget.dataset.id)
    let theTurnID = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './../details/details?id='+theTurnID
    })
  },
 // 单击改变样式
 click: function (e) {
   var ids = e.currentTarget.dataset.id;  //获取自定义的id 
   var good = "";  
   if(ids == '0'){
     good = [
       { id: 0, name: "苹果",  goodspic: "/icon/nopic.png",price1:"32",price2:"31",count:"0"},
       { id: 1, name: "香蕉",  goodspic: "/icon/nopic.png",price1:"32",price2:"31",count:"0"},

     ];
   } else if (ids == 1){
     good = [
       { id: 0, name: "芒果",  goodspic: "/icon/nopic.png",price1:"32",price2:"31",count:"0"},
       { id: 1, name: "葡萄", goodspic: "/icon/nopic.png",price1:"32",price2:"31",count:"0"},

     ];
     } else if (ids == 2) {
     good = [
       { id: 0, name: "火龙果",  goodspic: "/icon/nopic.png",price1:"32",price2:"31",count:"0"},
       { id: 1, name: "猕猴桃",  goodspic: "/icon/nopic.png",price1:"32",price2:"31",count:"0"},

     ]; 
     }else if (ids == 3) {
       good = [
         { id: 0, name: "黑加仑",  goodspic: "/icon/nopic.png",price1:"32",price2:"31",count:"0"},
         { id: 1, name: "牛油果",  goodspic: "/icon/nopic.png",price1:"32",price2:"31",count:"0"},

       ];
   }else if(ids == 4){
     good = [
        { id: 0, name: "苹果", url: "/icon/nopic.png" },
       { id: 1, name: "芒果", url: "/icon/nopic.png" },

     ];
   }
   this.setData({
     id: ids,  //把获取的自定义id赋给当前组件的id(即获取当前组件)  
     goods: good
   })
 }
})
