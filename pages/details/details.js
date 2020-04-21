const app = getApp()
Page({
  onLoad:function(option){
    this.setData({
      goodsID: option.id
    })
    console.log(this.data.goodsID);
    this.getDate();
    this.getRule();
  },
  data: {
    isLike: false,
    showDialog:false,
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
  },
  //预览图片
  previewImage: function (e) {
    var current = e.target.dataset.src;

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
    if (Number(this.data.buysum)==0){
      this.setData({
        showDialog: !this.data.showDialog
      });
    }else{
      wx.showToast({
        title: '添加购物车成功',
        icon: 'success',
        duration: 3000
      });
    }
  },
  toclickflavor(e){
    // console.log(e.currentTarget.dataset.id)
    this.setData({
      clickflavor: e.currentTarget.dataset.id
    });
  },
  closeDialog:function(){
    this.setData({
      showDialog: false
    });
  },
  // 收藏
  addLike() {
    this.setData({
      isLike: !this.data.isLike
    });
  },
  // 跳到购物车
  toCar() {
    wx.switchTab({
      url: '/pages/cart/cart'
    })
  },
  // 立即购买
  immeBuy() {
    wx.showToast({
      title: '添加购物车成功',
      icon: 'success',
      duration: 3000
    });
  },
  getDate:function() {
    // console.log(app.globalData.db)
    app.globalData.db.collection('goods').where({
      _id: this.data.goodsID
    }).get().then((res)=>{
      let pic = [];
      let detailspic = [];
      pic.push(res.data[0].goodspic)
      pic.push(res.data[0].gdetailspic)
      detailspic.push(res.data[0].gdetailspic)
      this.setData({
        goodmsg: res.data[0],
        flavor: res.data[0].flavor,
        imgUrls: pic,
        detailImg: detailspic
      })
      console.log(this.data.flavor)
    })
  },
  getRule:function(){
    app.globalData.db.collection('rule').where({
      goodsid: this.data.goodsID
    }).get().then((res) => {
      console.log(res.data)
      this.setData({
        rule: res.data
      })
    })
  },
  //点-
  subNum(){
    let newsum = Number(this.data.buysum)-1
    this.setData({
      buysum: newsum
    })
    this.calculateprice()
  },
  //点+
  addNum(){
    let newsum = Number(this.data.buysum) + 1
    this.setData({
      buysum: newsum
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
    for(var i=0;i<this.data.rule.length;i++){
      if (Number(this.data.rule[i].maxnum)!=0){
        if (Number(this.data.rule[i].minnum) <= Number(this.data.buysum)){
          if (Number(this.data.buysum)<=Number(this.data.rule[i].maxnum)){
            newsum = Number(this.data.rule[i].price) * Number(this.data.buysum)
            newsingleprice = this.data.rule[i].price
            break;
          }
        }
      }else{
        newsum = Number(this.data.rule[i].price) * Number(this.data.buysum)
        newsingleprice = this.data.rule[i].price
        break;
      }
    }
    this.setData({
      singleprice: newsingleprice,
      pricesum: newsum
    })
    // console.log(newsum)
  }
})