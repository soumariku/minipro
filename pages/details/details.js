Page({
  data: {
    isLike: false,
    showDialog:false,
    // banner
    imgUrls: [
      "cloud://minishop-kxw64.6d69-minishop-kxw64-1301898931/pic1.jpg",
      "cloud://minishop-kxw64.6d69-minishop-kxw64-1301898931/pic2.jpg"
    ],
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔,3s
    duration: 1000, //  滑动动画时长1s

    // 商品详情介绍
    detailImg: [
      "cloud://minishop-kxw64.6d69-minishop-kxw64-1301898931/pic2.jpg"
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
      title: '购买成功',
      icon: 'success',
      duration: 2000
    });
  },
})