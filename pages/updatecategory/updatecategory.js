// pages/updatecategory/updatecategory.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:'./../../icon/nopic.png',
    hasimg:'暂无图片',
    categoryName:''
  },
  getcategory(e){
    let inputmsg = e.detail.value;
    this.setData({
      categoryName:inputmsg
    })
  },
  uploadPic() {
    let that = this;
    let timestamp = (new Date()).valueOf();
    wx.chooseImage({
     success: chooseResult => {
      wx.showLoading({
       title: '上传中。。。',
      })
      // 将图片上传至云存储空间
      wx.cloud.uploadFile({
       // 指定上传到的云路径
       cloudPath: timestamp + '.png',
       // 指定要上传的文件的小程序临时文件路径
       filePath: chooseResult.tempFilePaths[0],
       // 成功回调
       success: res => {
        console.log('上传成功', res)
        wx.hideLoading()
        wx.showToast({
         title: '上传图片成功',
        })
        if (res.fileID) {
         that.setData({
          zhaopian: '图片如下',
          imgUrl: res.fileID,
          hasimg:'上传成功'
         })
        }
   
       },
      })
     },
    })
   },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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