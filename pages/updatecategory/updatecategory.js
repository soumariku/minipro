// pages/updatecategory/updatecategory.js
const app  = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pathImgUrl:'./../../icon/nopic.png',
    hasimg:'暂无图片',
    categoryName:'',
    isUpdate:false,
    updateID:''
  },
  getcategory(e){
    let inputmsg = e.detail.value;
    this.setData({
      categoryName:inputmsg
    })
  },
  uploadPic() {
    let that = this;
    wx.chooseImage({
     success: chooseResult => {
         that.setData({
          pathImgUrl: chooseResult.tempFilePaths[0],
          hasimg:'上传成功',
          hasChangeImg:true
         })     
     },
    })
   },
   checkUpdate(){
     let _this = this;
     if(_this.data.isUpdate == true){
      console.log('这是更新')
      _this.updateCategory()
     }else{
      console.log('这是插入')
      _this.insertCategory()
     }
   },
   //插入
   insertCategory(){
    let _this = this;
    let timestamp = (new Date()).valueOf();
    wx.showLoading({
      title: '上传中。。。',
    })
    if(_this.data.hasChangeImg == true){
      var index1=_this.data.pathImgUrl.lastIndexOf(".");
      var index2=_this.data.pathImgUrl.length;
      var type=_this.data.pathImgUrl.substring(index1,index2);
      wx.cloud.uploadFile({
        // 指定上传到的云路径
        cloudPath: timestamp + type,
        // 指定要上传的文件的小程序临时文件路径
        filePath: _this.data.pathImgUrl,
        // 成功回调
        success: res => {
          console.log('上传成功', res)
          if(res.fileID){
            let newpic = res.fileID
            app.globalData.db.collection('CATEGORY').add({
              data:{
                name: _this.data.categoryName,
                pic : newpic
              }
            }).then((res)=>{
                console.log(res)
                wx.showToast({
                  title: '上传图片成功',
                })
                wx.hideLoading()
                var pages = getCurrentPages(); // 当前页面
                var beforePage = pages[pages.length - 2]; // 前一个页面
                wx.navigateBack({
                  delta: 1,  // 返回上一级页面。
                  complete: (res) => {
                    beforePage.updateCategory()
                  },
                })
              })
            }
        },
        fail:res =>{
          wx.showToast({
            title: '图片上传失败'
          })
        }
        })
    }else{
      wx.showToast({
        title: '请传入图片',
      })
    }
   },
   //更新
   updateCategory(){
      let _this = this;
      let timestamp = (new Date()).valueOf();
      let theid = _this.data.updateID
      wx.showLoading({
        title: '上传中。。。',
       })
      if(_this.data.hasChangeImg == true){
        wx.cloud.uploadFile({
        // 指定上传到的云路径
        cloudPath: timestamp + '.png',
        // 指定要上传的文件的小程序临时文件路径
        filePath: _this.data.pathImgUrl,
        // 成功回调
        success: res => {
          console.log('上传成功', res)
          wx.hideLoading()
          if (res.fileID) {
            let newpic = res.fileID
            console.log(theid)
            wx.cloud.callFunction({
              name: "setMsg",
              data: {
                id:theid,
                collection:'CATEGORY',
                data:{
                  name: _this.data.categoryName,
                  pic : newpic
                }
              }
            }).then((res)=>{
              wx.showToast({
                title: '上传图片成功',
              })
              var pages = getCurrentPages(); // 当前页面
              var beforePage = pages[pages.length - 2]; // 前一个页面
              wx.navigateBack({
                delta: 1,  // 返回上一级页面。
                complete: (res) => {
                  beforePage.updateCategory()
                },
              })
            })
            // app.globalData.db.collection('CATEGORY').doc(theid).set({
            //   data:{
            //     name: _this.data.categoryName,
            //     pic : newpic
            //   },
            //   success(res){
            //     wx.showToast({
            //       title: '上传图片成功',
            //     })
            //     wx.navigateBack({
            //       delta: 1,  // 返回上一级页面。
            //       complete: (res) => {
            //         console.log(res)
            //       },
            //     })
            //   },
            // })
          }
        },
        fail:res =>{
          wx.showToast({
            title: '图片上传失败'
          })
        }
        })
      }else{
        wx.cloud.callFunction({
          name: "setMsg",
          data: {
            id:theid,
            collection:'CATEGORY',
            data:{
              name: _this.data.categoryName,
              pic : _this.data.pathImgUrl
            }
          }
        }).then((res)=>{
          wx.showToast({
            title: '上传图片成功',
          })
          var pages = getCurrentPages(); // 当前页面
          var beforePage = pages[pages.length - 2]; // 前一个页面
          wx.navigateBack({
            delta: 1,  // 返回上一级页面。
            complete: (res) => {
              beforePage.updateCategory()
            },
          })
        })
        // app.globalData.db.collection('CATEGORY').doc(theid).set({
        //   data:{
        //     name: _this.data.categoryName,
        //     pic : _this.data.pathImgUrl
        //   },
        //   success(res){
        //     wx.showToast({
        //       title: '上传图片成功',
        //     })
        //     var pages = getCurrentPages(); // 当前页面
        //     var beforePage = pages[pages.length - 2]; // 前一个页面
        //     wx.navigateBack({
        //       delta: 1,  // 返回上一级页面。
        //       complete: (res) => {
        //         beforePage.updateCategory()
        //       },
        //     })
        //   },
        // })
      }
   },
   deleteCategory(e){
     console.log(e)
      let id = this.data.updateID
      wx.showLoading({
        title: '删除中。。。',
       })
      wx.cloud.callFunction({
        name:'deleteData',
        data: {
          id: id,
          collection:'CATEGORY'
        },
        complete: res => {
          console.log(res)
          wx.hideLoading()
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 3000
          });
          var pages = getCurrentPages(); // 当前页面
          var beforePage = pages[pages.length - 2]; // 前一个页面
          wx.navigateBack({
            delta: 1,  // 返回上一级页面。
            complete: (res) => {
              beforePage.updateCategory()
            },
          })
        }
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
   getCategory(){
     let _this = this
     console.log(_this.data.updateID)
     app.globalData.db.collection('CATEGORY').where({
       _id:_this.data.updateID
     }).get().then((res)=>{
       console.log(res)
       _this.setData({
         categoryName : res.data[0].name,
         pathImgUrl:res.data[0].pic
       })
     })
   },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id != 'undefined'){
      this.setData({
        isUpdate : true,
        updateID : options.id
      })
      this.getCategory()
    }

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