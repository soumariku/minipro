//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
  show:true,
  motto: 'Hello World',
  userInfo: {},
  hasUserInfo: false,
  canIUse: wx.canIUse('button.open-type.getUserInfo'),
  imgUrls: [   
  ],
  indicatorDots: true,
  autoplay: false,
  interval: 5000,
  duration: 1000,
  phone: '',
  password: '',
  success: false,
  },
  cancel:function(){
    wx.showModal({
       title: '警告',
       content: '您点击了拒绝授权,为保障您的利益请进行授权',
       })
   },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // 获取输入账号 
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
 
  // 获取输入密码 
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
 
  // 登录 
  login: function () {
    var that = this;   
    var warn = null; //warn为当手机号为空或格式不正确时提示用户的文字，默认为空
    if (that.data.phone.length == 0) {
      wx.showToast({
        title: '用户名不能为空',
        icon: 'loading',
        duration: 1000
      })
    } else if (that.data.password.length == 0) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'loading',
        duration: 1000
      })
    }else {
      app.globalData.db.collection('user').where({
        // name:this.data.phone,
        // password:this.data.password
      }).get().then((res)=>{
        console.log(res)
        if(res.data.length!=0){
          wx.setStorageSync("name", this.data.phone)
          wx.setStorageSync("password", this.data.password)
          app.globalData.role = res.data[0].role
          app.globalData.hasLogin = true
          console.log( app.globalData.role)
          wx.reLaunch({
            url: './../home/home',
          })
        }else{
          warn = "账号或密码错误";
            wx.showModal({
              title: '提示',
              content: warn
            })
        }
      })
    }
  },
  confirm: function () {
    var that = this
    wx.getUserInfo({
    //获取头像昵称等仅需要调用wx.getUserInfo方法，但要注意button的open-type="getUserInfo"
      success: function (res) {
        console.log(res);
        app.globalData.userInfo = res.userInfo
      }
    })
    wx.login({
    //获取code需要wx.login方法，发送code到后台换取用户的openID，code是变化的而openID唯一
      success: function (res) {
        console.log(res.code)
        console.log(res)
        //发送请求
        // app.getOpenId()
        wx.cloud.callFunction({
          name: 'getOpenid',
          complete: res => {
            console.log(res)
            console.log('云函数获取到的openid: ', res.result.openid)
            var openid = res.result.openid;
            // that.setData({
            //   openid: openid
            // })
            wx.setStorageSync("openid", res.result.openid)
            app.globalData.show = true
            that.setData({
              show:app.globalData
            }) 
            that.login()
            console.log(openid)
          }
        })
        // wx.request({
        //   url: API.getOpenId, //你解析用户openID的接口地址
        //   data: {
        //     code: res.code,
        //     headImage: that.data.avatarUrl,
        //     nickName: that.data.nickName,
        //   },
        //   method: "POST",
        //   header: {
        //     //'content-type': 'application/json' //默认值
        //     "Content-Type": "application/json;charset=UTF-8",
        //   },
        //   success: function (res) {
        //     console.log(res.data)
        //     console.log("获取到的数据为：" + res.data)
        //     wx.setStorageSync("openid", res.data)
        //     that.setData({
        //       show: true
        //     })
        //   }
        // })
      }
    })
  },
  checkopenid(){
    let openid = wx.getStorageSync('openid')
    if (openid.length <= 0) {
      //查看用户之前是否已经授权登录过，如果没有就让授权弹框显示，并让用户按指示授权
          app.globalData.show = false
          this.setData({
            show:false
          })
      } else {
          app.globalData.show = false
          this.login()
          this.setData({
            show:true
          })
      }
      
  },
  onLoad: function () {
    let openid = wx.getStorageSync('openid')
    let name = wx.getStorageSync('name')
    let password = wx.getStorageSync('password')
    this.setData({
      phone: name,
      password: password
    })
    console.log('openidopenidopenid',openid)
    
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
