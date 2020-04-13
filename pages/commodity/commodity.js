Page({
  data:{
     pres: [
     {    id:"0",
       preX: "推荐分类"   },
     {    id: "1",
       preX: "食品生鲜"   },
     {    id: "2",
       preX: "潮流女装"   },
      {    id: "3",      
        preX: "品牌男装"  },
      {   id: "4",
        preX: "医疗器械"  }
   ],
   goods:[
     { id: 0, name: "苹果", url: "/icon/nopic.png"},
     { id: 1, name: "香蕉", url: "/icon/nopic.png"},
   ],
   id: 0,
  },
 // 单击改变样式
 click: function (e) {
   var ids = e.currentTarget.dataset.id;  //获取自定义的id 
   var good = "";  
   if(ids == 0){
     good = [
       { id: 0, name: "苹果", url: "/icon/nopic.png" },
       { id: 1, name: "香蕉", url: "/icon/nopic.png" },

     ];
   } else if (ids == 1){
     good = [
       { id: 0, name: "芒果", url: "/icon/nopic.png" },
       { id: 1, name: "葡萄", url: "/icon/nopic.png" },

     ];
     } else if (ids == 2) {
     good = [
       { id: 0, name: "火龙果", url: "/icon/nopic.png" },
       { id: 1, name: "猕猴桃", url: "/icon/nopic.png" },

     ]; 
     }else if (ids == 3) {
       good = [
         { id: 0, name: "黑加仑", url: "/icon/nopic.png" },
         { id: 1, name: "牛油果", url: "/icon/nopic.png" },

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
