// pages/customersetting/customersetting.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressSetting:false,
    telephone:'',
    teleChange:true,
    address:'',
    addressChange:true,
  },
  canChange(e){
    console.log(e)
    this.setData({
      teleChange:true,
      addressChange:true
    })
  },
  getData(){
    app.globalData.db.collection('customer').where({
      name:app.globalData.userInfo.nickName
    }).get().then((res=>{
      if(res.data.length>0){
        this.setData({
          telephone:res.data[0].telephone,
          address:res.data[0].address,
        })
        if(res.data[0].telephone!=''){
          this.setData({
            teleChange:false
          })
        }
        if(res.data[0].address!=''){
          this.setData({
            addressChange:false
          })
        }
      }
    }))
  },
  bindFormSubmit: function(e) {
    let telemsg = '';
    let addressmsg = '';
    let id = '';
    if(this.data.addressSetting==true){
      addressmsg = e.detail.value.textarea
    }else{
      telemsg = e.detail.value.textarea
    }
    // console.log(addressmsg,telemsg)
    app.globalData.db.collection('customer').where({
      name:app.globalData.userInfo.nickName
    }).get().then((res)=>{
      if(res.data.length==0){
        console.log(res)
        app.globalData.db.collection('customer').add({
          data:{
            name:app.globalData.userInfo.nickName,
            telephone:telemsg,
            address:addressmsg
          }
        }).then((res)=>{
          console.log(res)
        })
      }else{
        id = res.data[0]._id;
        if(this.data.addressSetting==true){
          this.changeAddress(id,addressmsg)
        }else{
          this.changeTele(id,telemsg)
        }
      }
      
    })
    // console.log(e.detail.value.textarea)
    
  },
  //更新手机
  changeTele(id,telemsg){
    app.globalData.db.collection('customer').doc(id).update({
      data:{
        telephone:telemsg
      },
      success: res => {
        this.setData({
          addressChange: false
        })
        wx.showToast({
          title: '更改成功',
          icon: 'check',
          duration: 3000
        });
      },
      fail: err => {
        icon: 'none',
        console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  },
  //更新地址
  changeAddress(id,addressmsg){
    app.globalData.db.collection('customer').doc(id).update({
      data:{
        address:addressmsg
      },
      success: res => {
        this.setData({
          addressChange: false
        })
        wx.showToast({
          title: '更改成功',
          icon: 'check',
          duration: 3000
        });
      },
      fail: err => {
        icon: 'none',
        console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id=='1'){
      this.setData({
        addressSetting : true
      })
    }else{
      this.setData({
        addressSetting : false
      }) 
    }
    this.getData()
    console.log(options.id)
    console.log(this.data.addressSetting)
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