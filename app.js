//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    if(!wx.cloud){
      console.log('请使用2.2.3以上版本')
    }else{
      wx.cloud.init({
        env:'minishop-kxw64'
      })
      this.globalData.db = wx.cloud.database({
        //这个是环境ID不是环境名称
        env: 'minishop-kxw64'
      })
    }
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // wx.login({
          //   complete: (res) => {
          //     console.log(res)
          //     var code = res.code; //返回code
          //     console.log(code);
          //     wx.request({
          //         url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx32372f6ba81791b7&&secret=e50ac757af25dbc20b42f9e92a157f51&js_code=' + code + '&grant_type=authorization_code',
          //         data: {},
          //         header: {
          //           'content-type': 'json'
          //         },
          //         success: function (res) {
          //           var openid = res.data.openid //返回openid
          //           console.log('openid为' + openid);
          //         }
          //       })
          //   },
          // })
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(this.globalData.userInfo)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    db:null,
    role:''
  }
})