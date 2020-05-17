const app = getApp()
const API = require('../../utils/API.js');
const device = wx.getSystemInfoSync()
const width = device.windowWidth
Page({
  onLoad:function(option){
    let num = 0
    for(var item in API.orderinfo){ 
      num +=Number(API.orderinfo[item].count)
    }
    this.setData({
      goodsID: option.id,
      onshopnum:String(num),
      window_width: app.globalData.window_width
    })
    console.log(this.data.goodsID);
    this.getDate();
    this.getRule();
    this.getLike();
  },
  onShow(){
  },
  data: {
    isLike: false,//收藏
    showDialog:false,
    onshopnum:0,
    goodsID:'',
    goodmsg:[],
    flavor:[],
    rule:[],
    singleprice:'',
    buysum:0,
    pricesum:0,
    clickflavor:'',
    // banner
    imgUrls: [
      // "cloud://minishop-kxw64.6d69-minishop-kxw64-1301898931/pic1.jpg",
      // "cloud://minishop-kxw64.6d69-minishop-kxw64-1301898931/pic2.jpg"
    ],
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔,3s
    duration: 1000, //  滑动动画时长1s

    // 商品详情介绍
    detailImg: [
      // "cloud://minishop-kxw64.6d69-minishop-kxw64-1301898931/pic2.jpg"
    ],
    width
  },
  //预览图片
  previewImage: function (e) {
    var current = e.target.dataset.src;
    console.log(this.data.width)
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.imgUrls // 需要预览的图片http链接列表  
    })
  },
  toggleDialog:function(){
    this.setData({
      showDialog: !this.data.showDialog
    });
  },
  tocalDialog: function () {
    // let theMsg = API.orderinfo.filter(s=>{return s.nameGood==this.data.goodmsg.name&&s.clickflavor==this.data.clickflavor})
    // if(!!theMsg.length){
    //   this.tocal()
    //   //购物车存在该商品
    //   wx.showToast({
    //     title: '商品数量已更改',
    //     duration: 2000
    //   });
    //   this.setData({
    //     showDialog: false
    //   });
    // }else{
      if (Number(this.data.buysum)==0){
        if(this.data.showDialog){
          wx.showToast({
            title: '请添加数量',
            icon: 'none',
            image:'../../icon/close.png',
            duration: 1000
          });
        }else{
          this.setData({
            showDialog: !this.data.showDialog
          });
        }
      }else{
          this.tocal()
          wx.showToast({
            title: '添加购物车成功',
            icon: 'success',
            duration: 3000
          });
          this.setData({
            showDialog: false
          });
      }
  },
  //点击口味
  toclickflavor(e){
    // console.log(e.currentTarget.dataset.id)
    this.setData({
      clickflavor: e.currentTarget.dataset.id
    });
  },
  getsamenum(flavornum){
    let samegoods = API.orderinfo.filter(s=>{return s.nameGood==this.data.goodmsg.name})
    console.log('samegoods',samegoods)
    let samegoodsnum = flavornum;
    for(var k=0;k<samegoods.length;k++){
      samegoodsnum = Number(samegoodsnum)+Number(samegoods[k].count)
    }
    console.log('samegoodsnum',samegoodsnum)
    var newprice = this.getnewprice(samegoodsnum)
    return newprice
  },
  getnewprice(samegoodsnum){
    let newsingleprice = 0
    for(var i=0;i<this.data.rule.length;i++){
      if (Number(this.data.rule[i].maxnum)!=0){
        if (Number(this.data.rule[i].minnum) <= Number(samegoodsnum)){
          if (Number(samegoodsnum)<=Number(this.data.rule[i].maxnum)){
            newsingleprice = this.data.rule[i].price
            break;
          }
        }
      }else{
        newsingleprice = this.data.rule[i].price
        break;
      }
      
    }
    return newsingleprice
  },
  //添加购物车
  tocal(){
    console.log(!!this.data.flavor.length)
    if(!!this.data.flavor.length){
      let goods = this.data.flavor.filter(f=>{return f.flavornum!=0})
      for(var i=0;i<goods.length;i++){
        let theMsg = API.orderinfo.filter(s=>{return s.nameGood==this.data.goodmsg.name&&s.clickflavor==goods[i].flavor})
        let samegoods = API.orderinfo.filter(s=>{return s.nameGood==this.data.goodmsg.name})
        if(!!theMsg.length){
          let newsingleprice = this.getsamenum(goods[i].flavornum)
          for(var j=0;j<API.orderinfo.length;j++){
            if(API.orderinfo[j]==theMsg[0]){
              let newcount = Number(API.orderinfo[j].count)+Number(goods[i].flavornum)
              API.orderinfo[j].count = newcount
            }
            if(API.orderinfo[j].nameGood==this.data.goodmsg.name){
              API.orderinfo[j].npriceGood = newsingleprice
            }
          }
        }else if(!!samegoods.length){
          let newsingleprice = this.getsamenum(goods[i].flavornum)
          console.log('newsingleprice',newsingleprice)
          for(var j=0;j<API.orderinfo.length;j++){
            if(API.orderinfo[j].nameGood==this.data.goodmsg.name){
              API.orderinfo[j].npriceGood = newsingleprice
            }
          }
          let orderlist = []
          orderlist = {
            imgGood:this.data.imgUrls[0],
            nameGood:this.data.goodmsg.name,
            npriceGood:Number(newsingleprice).toFixed(2),
            opriceGood:this.data.goodmsg.price1,
            count:Number(goods[i].flavornum),
            id:this.data.goodsID,
            selected: true,
            clickflavor: goods[i].flavor,
            levelname:this.data.levelname,
            buyingprice:this.data.buyingprice
          }
          API.orderinfo.push(orderlist)
        }else{
          let orderlist = []
          orderlist = {
            imgGood:this.data.imgUrls[0],
            nameGood:this.data.goodmsg.name,
            npriceGood:Number(this.data.singleprice).toFixed(2),
            opriceGood:this.data.goodmsg.price1,
            count:Number(goods[i].flavornum),
            id:this.data.goodsID,
            selected: true,
            clickflavor: goods[i].flavor,
            levelname:this.data.levelname,
            buyingprice:this.data.buyingprice
          }
          API.orderinfo.push(orderlist)
        }
      }
    }else{
      //无口味
      let theMsg = API.orderinfo.filter(s=>{return s.nameGood==this.data.goodmsg.name})
      if(!!theMsg.length){
        for(var j=0;j<API.orderinfo.length;j++){
          if(API.orderinfo[j]==theMsg[0]){
            let newsingleprice = 0
            let newcount = Number(API.orderinfo[j].count)+Number(this.data.buysum)
            for(var i=0;i<this.data.rule.length;i++){
              if (Number(this.data.rule[i].maxnum)!=0){
                if (Number(this.data.rule[i].minnum) <= Number(newcount)){
                  if (Number(newcount)<=Number(this.data.rule[i].maxnum)){
                    newsingleprice = this.data.rule[i].price
                    break;
                  }
                }
              }else{
                newsingleprice = this.data.rule[i].price
                break;
              }
            }
            API.orderinfo[j].count = newcount
            API.orderinfo[j].npriceGood = newsingleprice
            console.log('yew')
          }
        }
      }else{
        let orderlist = []
        orderlist = {
          imgGood:this.data.imgUrls[0],
          nameGood:this.data.goodmsg.name,
          npriceGood:Number(this.data.singleprice),
          opriceGood:this.data.goodmsg.price1,
          count:Number(this.data.buysum),
          id:this.data.goodsID,
          selected: true,
          clickflavor: this.data.clickflavor,
          levelname:this.data.levelname,
          buyingprice:this.data.buyingprice
        }
        API.orderinfo.push(orderlist)
      }
    }
    let num = 0
    for(var item in API.orderinfo){ 
      num +=Number(API.orderinfo[item].count)
    }
    this.setData({
      onshopnum:String(num)
    })
  },
  closeDialog:function(){
    this.setData({
      showDialog: false
    });
  },
  // 收藏
  addLike() {
    app.globalData.db.collection('collection').where({
      goodsid:this.data.goodsID,
      collector:app.globalData.userInfo.nickName
    }).get().then((res)=>{
      let id = ''
      if(res.data.length>0){
        id = res.data[0]._id
        wx.cloud.callFunction({
          name:'deleteData',
          data: {
            id: id,
            collection:'collection'
          },
          complete: res => {
            this.setData({
              isLike: false
            });
          }
        })
      }else{
        app.globalData.db.collection('collection').add({
          // data 字段表示需新增的 JSON 数据
          data: {
            goodsid: this.data.goodsID,
            collector:app.globalData.userInfo.nickName
          }
        })
        .then(res => {
          this.setData({
            isLike: true
          });
          wx.showToast({
            title: '添加收藏成功',
            icon: 'success',
            duration: 3000
          });
        })
        
      }  
    }) 
  },
  // 收藏
  getLike() {
    app.globalData.db.collection('collection').where({
      goodsid:this.data.goodsID,
      collector:app.globalData.userInfo.nickName
    }).get().then((res)=>{
      if(res.data.length>0){
        this.setData({
          isLike: true
        });
      }else{
        this.setData({
          isLike: false
        });
      }  
    }) 
  },
  // 跳到购物车
  toCar() {
    wx.switchTab({
      url: './../shop/shop'
    })
  },
  // 立即购买
  immeBuy() {
    // let theMsg = API.orderinfo.filter(s=>{return s.nameGood==this.data.goodmsg.name&&s.clickflavor==this.data.clickflavor})
    // if(!!theMsg.length){
    //   wx.showToast({
    //     title: '购物车存在该商品',
    //     icon: 'none',
    //     image:'../../icon/close.png',
    //     duration: 2000
    //   });
    // }else{
      if (Number(this.data.buysum)==0){
        if(this.data.showDialog){
          wx.showToast({
            title: '请添加数量',
            icon: 'none',
            image:'../../icon/close.png',
            duration: 1000
          });
        }else{
          this.setData({
            showDialog: !this.data.showDialog
          });
        }
      }else{
        if(this.data.showDialog){
          this.tocal()
          wx.reLaunch({
            url: '../shop/shop',
          })
        }else{
          wx.reLaunch({
            url: '../shop/shop',
          })
        }
      }
  },
  getDate:function() {
    // console.log(app.globalData.db)
    app.globalData.db.collection('goods').where({
      _id: this.data.goodsID
    }).get().then((res)=>{
      let pic = [];
      let detailspic = [];
      let flavorlist = [];
      pic.push(res.data[0].goodspic)
      pic.push(res.data[0].gdetailspic1)
      
      console.log(res.data[0].flavor)
      detailspic.push(res.data[0].gdetailspic1)
      detailspic.push(res.data[0].gdetailspic2)
      detailspic.push(res.data[0].gdetailspic3)
      for(var i=0;i<res.data[0].flavor.length;i++){
        let list = {flavor:res.data[0].flavor[i].flavor,flavornum:0,count:res.data[0].flavor[i].count}
        flavorlist.push(list)
      }
      this.setData({
        goodmsg: res.data[0],
        goodsmsg:res.data[0].goodsmsg,
        flavor: flavorlist,
        imgUrls: pic,
        detailImg: detailspic,
        buyingprice:res.data[0].buyingprice,
        goodscount:res.data[0].goodscount
      })
      console.log(this.data.flavor)
     console.log(this.data.goodmsg)
    })
  },
  getRule:function(){
    app.globalData.db.collection('rule').where({
      goodsid: this.data.goodsID
    }).orderBy('price', 'desc').get().then((res) => {
      console.log(res.data)
      this.setData({
        rule: res.data
      })
    })
  },
  //点-
  subNum(){
      if(this.data.buysum==0){
        wx.showToast({
          title: '商品数量为0',
          icon: 'none',
          image:'../../icon/close.png',
          duration: 1000
        });
      }else{
        let newsum = Number(this.data.buysum)-1
        this.setData({
          buysum: newsum
        })
        this.calculateprice()
      }
  },
  flavorSub(e){
    console.log(e.currentTarget.dataset.index)
    let index = e.currentTarget.dataset.index
    let newflvor = this.data.flavor
    if(newflvor[index].flavornum==0){
      wx.showToast({
        title: '商品数量为0',
        icon: 'none',
        image:'../../icon/close.png',
        duration: 1000
      });
    }else{
      let newsum = Number(this.data.buysum)-1
      newflvor[index].flavornum = Number(newflvor[index].flavornum)-1
      this.setData({
        buysum: newsum,
        flavor:newflvor
      })
      this.calculateprice()
    }
  },
  //点+
  addNum(){
    let newsum = Number(this.data.buysum) + 1
    this.setData({
      buysum: newsum
    })
    this.calculateprice()
  },
  flavorAdd(e){
    console.log(e.currentTarget.dataset.index)
    let index = e.currentTarget.dataset.index
    let newflvor = this.data.flavor
    newflvor[index].flavornum = Number(newflvor[index].flavornum)+1
    let newsum = Number(this.data.buysum) + 1
    this.setData({
      buysum: newsum,
      flavor:newflvor
    })
    this.calculateprice()
  },
  //输入购买数量
  bindinput(e){
    if(!e.detail.value){
      this.setData({
        buysum: 0
      })
    }else{
      this.setData({
        buysum: e.detail.value
      })
    }
    this.calculateprice()
  },
  //计算价格
  calculateprice(){
    let newsum = 0;
    let newsingleprice = '';
    let thelevel = ''
    for(var i=0;i<this.data.rule.length;i++){
      if (Number(this.data.rule[i].maxnum)!=0){
        if (Number(this.data.rule[i].minnum) <= Number(this.data.buysum)){
          if (Number(this.data.buysum)<=Number(this.data.rule[i].maxnum)){
            newsum = Number(this.data.rule[i].price) * Number(this.data.buysum)
            newsingleprice = this.data.rule[i].price
            thelevel = i
            break;
          }
        }
      }else{
        newsum = Number(this.data.rule[i].price) * Number(this.data.buysum)
        newsingleprice = this.data.rule[i].price
        thelevel = i
        break;
      }
    }
    this.setlevel(thelevel)
    this.setData({
      singleprice: newsingleprice,
      pricesum: newsum
    })
    // console.log(newsum)
  },
  setlevel(thelevel){
    let name = ''
    if(thelevel=='0'){
      name = '商品单价：'
    }else if(thelevel=='1'){
      name = '批发单价：'
    }else{
      name = '二批单价：'
    }
    this.setData({
      levelname:name
    })
  }
})