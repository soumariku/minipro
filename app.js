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
    this.getOpenid();
    this.getAccessToken();
    // this.sendmsg();
    // this.testSubmit();
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
  // 获取用户openid
  getOpenid() {
    let that = this;
    wx.cloud.callFunction({
      name: 'getOpenid',
      complete: res => {
        console.log('云函数获取到的openid: ', res.result.openId)
        var openid = res.result.openId;
        // that.setData({
        //   openid: openid
        // })
        console.log(openid)
      }
    })
  },
  getAccessToken() {
    let that = this;
    wx.cloud.callFunction({
      name: 'getAccessToken',
      complete: res => {
        console.log('云函数获取到的AccessToken: ', res.result)
        var accesstoken = JSON.parse(res.result);
        console.log(accesstoken.access_token)
      }
    })
  },
  sendmsg(){
    wx.cloud.callFunction({
      name:'sendUserMsg',
      complete: res => {
        console.log(res.result)
      }
    })
  },
  testSubmit(){
    // var self = this;
    // let _access_token = '32_5djAykw_jQF5Hp2XeiSkLkTjF8hfzAUsMY1RPlnlSCIPQLPzCB86sG_2hCSHRnpsNb9qvnqze0lpUlAwOGDZbjXkSHlVXFj1ffAN-HDbxGB_Ow3KAIVXpS4SO0D3265-botjV_DFGwGSXd_QZSLiAIAVOH';
    // let url = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + _access_token;
    // let _jsonData = {
    //     access_token: _access_token,
    //     touser: 'o6HCI5NR8UKfn6CBFAELDgL51ZwA',
    //     template_id: 'DHyPxxxYk-x_1_tsWCSliKOUZ8A808IzPc6-r0yO0gI',
    //     data: {
    //       "keyword1": { "value": "测试数据一", "color": "#173177" },
    //       "keyword2": { "value": "测试数据二", "color": "#173177" },
    //       "keyword3": { "value": "测试数据三", "color": "#173177" },
    //       "keyword4": { "value": "测试数据四", "color": "#173177" },
    //     }
    //   }
    // wx.request({
    //   url: url,
    //   data: _jsonData,
    //   method: 'POST',
    //   success: function (res) {
    //     console.log(res)
    //   },
    //   fail: function (err) {
    //     console.log('request fail ', err);
    //   },
    //   complete: function (res) {
    //     console.log("request completed!");
    //   }

    // })
    
    wx.cloud.callFunction({
      name: "pushMsg",
      data: {
        openid: 'o6HCI5NR8UKfn6CBFAELDgL51ZwA'
      }
    }).then(res => {
      console.log("推送消息成功", res)
    }).catch(res => {
      console.log("推送消息失败", res)
    })
  },
  toSubscribe(){
    
  },
  
  globalData: {
    userInfo: null,
    db:null,
    role:''
  }
})