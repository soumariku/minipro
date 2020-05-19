// pages/updateHome/updateHome.js
import WeCropper from '../../utils/we-cropper/we-cropper.js'
const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 100;
const app = getApp()
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
        x: 0, // 裁剪框x轴起点(width * fs * 0.128) / 2
        y: (height * 0.5 - 250 * 0.5), // 裁剪框y轴期起点
        width: width, // 裁剪框宽度
        height: (width/1.77)// 裁剪框高度
      }
    },
  },
  chooseImage: function (e) {
    console.log(e)
    let picnum = e.currentTarget.dataset.num
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
          type:type,
          picno:picnum
        });
        console.log('picnoaaaaaaaaaaaaaaaaaaaaaaaaa',that.data.picno)
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
        wx.cloud.uploadFile({
          cloudPath: timestamp + type,
          filePath: src,   //   这是截取后的图片
          success: function (res) {
            console.log('上传成功', res)
            wx.hideLoading()
            wx.showToast({
              title: '上传图片成功',
            })
            console.log(that.data.picno)
            if(that.data.picno=='1'){
              that.setData({
                img1: res.fileID,
                hasimg1:'上传成功',
                hasChangeImg1:true
              }) 
            }else if(that.data.picno=='2'){
              that.setData({
                img2: res.fileID,
                hasimg2:'上传成功',
                hasChangeImg2:true
               })  
            }
           
          },
          fail: function (res) {
            console.log(res)
            wx.showToast({
              title: '保存失败',
              duration: 3000
            });
          }
        })

      }
    })
  },
  gethorn(e){
    let inputmsg = e.detail.value;
    this.setData({
      horn:inputmsg
    })
  },
  getHomeMsg(){
    let _this = this
    app.globalData.db.collection('home').get().then((res)=>{
      console.log(res)
      _this.setData({
        id:res.data[0]._id,
        horn : res.data[0].horn,
        img1:res.data[0].img1,
        img2:res.data[0].img2,
      })
    })
  },
  updateHome(){
    let _this = this
    let theid = _this.data.id
    wx.cloud.callFunction({
      name: "setMsg",
      data: {
        id:theid,
        collection:'home',
        data:{
              horn:_this.data.horn,
              img1:_this.data.img1,
              img2:_this.data.img2
            }
      }
    }).then((res)=>{
      console.log(res)
        wx.showToast({
          title: '更新完成！',
        })
        var pages = getCurrentPages(); // 当前页面
        var beforePage = pages[pages.length - 2]; // 前一个页面
        wx.navigateBack({
          // delta: 1,  // 返回上一级页面。
          complete: (res) => {
            console.log(res)
          },
        })
    })
  },
  turnPreview(){
    wx.navigateBack({
      delta: 1,  // 返回上一级页面。
      complete: (res) => {
        console.log(res)
      },
    })
   },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHomeMsg()
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