// pages/testimg/testimg.js
import WeCropper from '../../utils/we-cropper/we-cropper.js'
const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 100;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 切图部分
    isShear: false,  //  这个时设置剪切图片的弹框是否显示
    cropperOpt: {  //基础设置 
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: 20, // 裁剪框x轴起点(width * fs * 0.128) / 2
        y: (height * 0.5 - 250 * 0.5), // 裁剪框y轴期起点
        width: width-40, // 裁剪框宽度
        height: width-40// 裁剪框高度
      }
    },
  },
  chooseImage: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: function (res) {
        var index1=res.tempFilePaths[0].lastIndexOf(".");
        var index2=res.tempFilePaths[0].length;
        var type=res.tempFilePaths[0].substring(index1,index2);
        // 切图部分
        that.setData({
          cutImage: 'show',
          isShear: true,
          type:type
        });
        that.wecropper.pushOrign(res.tempFilePaths[0]); 
      }
    })
  },
  touchStart(e) {    // 这里是剪切图片里面的方法，不能少
    this.wecropper.touchStart(e)
  },
  touchMove(e) {      // 这里是剪切图片里面的方法，不能少
    this.wecropper.touchMove(e)
  },
  touchEnd(e) {       // 这里是剪切图片里面的方法，不能少
    this.wecropper.touchEnd(e)
  },
  getCropperImage() {
    let type = this.data.type
    let timestamp = (new Date()).valueOf();
    var that = this;
    that.wecropper.getCropperImage((src) => {
      if (src) {
        console.log(src)
        //此处添加用户确定裁剪后执行的操作 src是截取到的图片路径
        that.setData({
          isShear: false,
          img: src,
        })
        // wx.cloud.uploadFile({
        //   cloudPath: timestamp + type,
        //   filePath: src,   //   这是截取后的图片
        //   success: function (res) {
        //     var data = res.data;   //  json 格式转换成对象，要看后端返回给你什么格式，我这里后端给的json格式的所以要转
        //     console.log(res)
        //     that.setData({
        //       path: data.msg,
        //     });
        //   },
        //   fail: function (res) {
        //     console.log(res)
        //     wx.showToast({
        //       title: '保存失败',
        //       duration: 3000
        //     });
        //   }
        // })

      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    const {
      cropperOpt
    } = _this.data
    new WeCropper(cropperOpt)
      .on('ready', (ctx) => { })
      .on('beforeImageLoad', (ctx) => {
        console.log(`before picture loaded, i can do something`)
        console.log(`current canvas context:`, ctx)
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        console.log(`picture loaded`)
        console.log(`current canvas context:`, ctx)
        wx.hideToast()
      })
      .on('beforeDraw', (ctx, instance) => {
        console.log(`before canvas draw,i can do something`)
        console.log(`current canvas context:`, ctx)
      })
      .updateCanvas();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})