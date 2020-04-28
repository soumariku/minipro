// pages/updateGoods/updateGoods.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    rulemsg:[],
    rule1:{},
    rule2:{},
    rule3:{maxnum:"0"},
    flavor:[],
    goodsid:'',
    isUpdate:false,
    ruleID:[]
  },
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    let newcatagory = ''
    for(var i=0;i<e.detail.value.length;i++){
      newcatagory = newcatagory+e.detail.value[i]
      console.log(newcatagory)
    }
    this.setData({
      catgory:newcatagory
    })
  },
  getCategory(){
    app.globalData.db.collection('CATEGORY').get().then((res)=>{
      let newitems = []
      for(var i=0;i<res.data.length;i++){
        let params = {}
        if(!!this.data.catgory){
          let choose = this.data.catgory.indexOf(String(i)) != -1
          params = {name:String(i),value:res.data[i].name,checked:choose}
        }else{
          params = {name:String(i),value:res.data[i].name}
        }  
        newitems.push(params)
      }
      this.setData({
        items:newitems
      })
    })
  },
  getGoods(){
    let _this = this
    app.globalData.db.collection('goods').where({
      _id:_this.data.goodsid
    }).get().then((res)=>{
      let allprice = []
      let rulemsg = []
      allprice.push(res.data[0].price1)
      allprice.push(res.data[0].price2)
      allprice.push(res.data[0].price3)
      _this.setData({
        name:res.data[0].name,
        catgory:res.data[0].catgory,
        flavor:res.data[0].flavor,
        gdetailspic:res.data[0].gdetailspic,
        goodspic:res.data[0].goodspic,
        buyingprice:res.data[0].buyingprice,
      })
      this.getCategory()
      console.log(allprice)
      console.log(allprice)
      for(var i=0;i<allprice.length;i++){
        this.getRule(allprice[i],i)
      }
      
        
    })
  },
  addflavor(){
    let newflavor = this.data.flavor;
    newflavor.push('');
    console.log(newflavor)
    this.setData({
      flavor:newflavor
    })
  },
  deleteflavor(e){
    console.log(e)
    let thekey = 0;
    for(var i = 0;i<this.data.flavor.length;i++){
      if(this.data.flavor[i]==e.currentTarget.dataset.id){
        thekey = i;
        break;
      }
    }
    let newflavor = this.data.flavor;
    newflavor.splice(thekey,1);
    this.setData({
      flavor:newflavor
    })
  },
  getRule(allprice,i){
    app.globalData.db.collection('rule').where({
      goodsid:this.data.goodsid,
      price:allprice
    }).get().then((res)=>{
      console.log(res)
      let prams = {
        maxnum:res.data[0].maxnum,
        minnum:res.data[0].minnum,
        _id:res.data[0]._id,
        name:res.data[0].name,
        price:res.data[0].price
      }
      var ruleNO = "rule"+String(Number(i)+1) 
      console.log(i,prams)
      this.setData({
        [ruleNO]:prams
      })
    })
  },
  checkUpdate(){
    // &&!!_this.data.goodspic&&!!_this.data.gdetailspic
    let _this = this
    if(!!_this.data.catgory&&!!_this.data.name&&!!_this.data.goodspic&&!!_this.data.gdetailspic&&!!_this.data.rule1.price&&!!_this.data.rule1.name&&!!_this.data.rule1.minnum&&!!_this.data.rule1.maxnum&&!!_this.data.rule2.price&&!!_this.data.rule2.name&&!!_this.data.rule2.minnum&&!!_this.data.rule2.maxnum&&!!_this.data.rule3.price&&!!_this.data.rule3.name&&!!_this.data.rule3.minnum&&!!_this.data.rule3.maxnum){
      if(this.data.isUpdate==true){
        this.updateGoods();
      }else{
        this.insertGoods()
      }
    }else{
      wx.showToast({
        title: '请确保每项不为控',
        icon: 'none',
        image:'../../icon/close.png',
        duration: 3000
      });
    }
  },
  deleteGoods(e){
    console.log(e)
    let _this = this
     let id = _this.data.goodsid
     wx.showLoading({
       title: '删除中。。。',
      })
     wx.cloud.callFunction({
      name:'deleteData',
      data: {
        id: id,
        collection:'goods'
      },
      complete: res => {
        _this.deleterule()
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
          // delta: 1,  // 返回上一级页面。
          complete: (res) => {
            console.log(res)
            beforePage.updategoods()
          },
        })
      }
    })
  },
  deleterule(){
    let _this = this
    let id = _this.data.goodsid
    app.globalData.db.collection('rule').where({
      goodsid:id
    }).get().then((res)=>{
      for(var i=0;i<res.data.length;i++){
        wx.cloud.callFunction({
          name:'deleteData',
          data: {
            id: res.data[i]._id,
            collection:'rule'
          },
          complete: res => {
            console.log(res)
          }
        })
      }
    }) 
  },
  insertGoods(){
    let _this = this
    console.log(_this.data.flavor)
    console.log(_this.data.catgory)
    console.log(_this.data.goodspic)
    console.log(_this.data.gdetailspic)
    console.log(_this.data.name)
    console.log(_this.data.rule1.price)
    console.log(_this.data.rule2.price)
    console.log(_this.data.rule3.price)
    console.log(_this.data.rule3.maxnum)
    console.log(!!this.data.rule1.name)
    app.globalData.db.collection('goods').add({
      data:{
        catgory: _this.data.catgory,
        flavor: _this.data.flavor,
        goodspic: _this.data.goodspic,
        gdetailspic:_this.data.gdetailspic,
        name: _this.data.name,
        price1: _this.data.rule1.price,
        price2: _this.data.rule2.price,
        price3: _this.data.rule3.price,
        buyingprice:_this.data.buyingprice
      }
    }).then((res)=>{
      console.log(res._id)
      _this.insertrule(res._id,_this.data.rule1);
      _this.insertrule(res._id,_this.data.rule2);
      _this.insertrule(res._id,_this.data.rule3);
      wx.showToast({
        title: '添加完成！',
      })
      var pages = getCurrentPages(); // 当前页面
      var beforePage = pages[pages.length - 2]; // 前一个页面
      wx.navigateBack({
        // delta: 1,  // 返回上一级页面。
        complete: (res) => {
          console.log(res)
          beforePage.updategoods()
        },
      })
    })
  },
  insertrule(id,rule){
    app.globalData.db.collection('rule').add({
      data:{
        goodsid:id,
        maxnum:rule.maxnum,
        minnum:rule.minnum,
        name:rule.name,
        price:rule.price
      }
    }).then((res)=>{
      console.log(res)
    })
  },
  updateGoods(){
    let _this = this
    let theid = _this.data.goodsid
    console.log(_this.data.flavor)
    console.log(_this.data.catgory)
    console.log(_this.data.goodspic)
    console.log(_this.data.gdetailspic)
    console.log(_this.data.name)
    console.log(_this.data.rule1.price)
    console.log(_this.data.rule2.price)
    console.log(_this.data.rule3.price)
    console.log(!!this.data.rule1.name)
    wx.cloud.callFunction({
      name: "setMsg",
      data: {
        id:theid,
        collection:'goods',
        data:{
              catgory: _this.data.catgory,
              flavor: _this.data.flavor,
              goodspic: _this.data.goodspic,
              gdetailspic:_this.data.gdetailspic,
              name: _this.data.name,
              price1: _this.data.rule1.price,
              price2: _this.data.rule2.price,
              price3: _this.data.rule3.price,
              buyingprice:_this.data.buyingprice
            }
      }
    }).then((res)=>{
      console.log(res)
        _this.updaterule(_this.data.rule1._id,_this.data.rule1);
        _this.updaterule(_this.data.rule2._id,_this.data.rule2);
        _this.updaterule(_this.data.rule3._id,_this.data.rule3);
        wx.showToast({
          title: '更新完成！',
        })
        var pages = getCurrentPages(); // 当前页面
        var beforePage = pages[pages.length - 2]; // 前一个页面
        wx.navigateBack({
          // delta: 1,  // 返回上一级页面。
          complete: (res) => {
            console.log(res)
            beforePage.updategoods()
          },
        })
    })
    // app.globalData.db.collection('goods').doc(theid).set({
    //   data:{
    //     catgory: _this.data.catgory,
    //     flavor: _this.data.flavor,
    //     goodspic: _this.data.goodspic,
    //     gdetailspic:_this.data.gdetailspic,
    //     name: _this.data.name,
    //     price1: _this.data.rule1.price,
    //     price2: _this.data.rule2.price,
    //     price3: _this.data.rule3.price
    //   },
    //   success(res){
    //     console.log(res)
    //     _this.updaterule(_this.data.rule1._id,_this.data.rule1);
    //     _this.updaterule(_this.data.rule2._id,_this.data.rule2);
    //     _this.updaterule(_this.data.rule3._id,_this.data.rule3);
    //     wx.showToast({
    //       title: '更新完成！',
    //     })
    //     var pages = getCurrentPages(); // 当前页面
    //     var beforePage = pages[pages.length - 2]; // 前一个页面
    //     wx.navigateBack({
    //       // delta: 1,  // 返回上一级页面。
    //       complete: (res) => {
    //         console.log(res)
    //         beforePage.updategoods()
    //       },
    //     })
    //   }
    // })
  },
  updaterule(id,rule){
    wx.cloud.callFunction({
      name: "setMsg",
      data: {
        id:id,
        collection:'rule',
        data:{
          goodsid:this.data.goodsid,
          maxnum:rule.maxnum,
          minnum:rule.minnum,
          name:rule.name,
          price:rule.price
        }
      }
    }).then((res)=>{
      console.log(res)
    })
    // app.globalData.db.collection('rule').doc(id).set({
    //   data:{
    //     goodsid:this.data.goodsid,
    //     maxnum:rule.maxnum,
    //     minnum:rule.minnum,
    //     name:rule.name,
    //     price:rule.price
    //   },
    //   success(res){
    //     console.log(res)
    //   }
    // })
  },
  changepic1(){
    let that = this;
    let timestamp = (new Date()).valueOf();
    wx.chooseImage({
     success: chooseResult => {
       var index1=chooseResult.tempFilePaths[0].lastIndexOf(".");
       var index2=chooseResult.tempFilePaths[0].length;
       var type=chooseResult.tempFilePaths[0].substring(index1,index2);
       wx.showLoading({
        title: '上传中。。。',
       })
       // 将图片上传至云存储空间
       wx.cloud.uploadFile({
        // 指定上传到的云路径
        cloudPath: timestamp + type,
        // 指定要上传的文件的小程序临时文件路径
        filePath: chooseResult.tempFilePaths[0],
        // 成功回调
        success: res => {
         console.log('上传成功', res)
         wx.hideLoading()
         wx.showToast({
          title: '上传图片成功',
         })
         that.setData({
          goodspic: res.fileID,
          hasimg1:'上传成功',
          hasChangeImg1:true
         })     
        },
        })
    }
  })
  },
  changepic2(){
    let that = this;
    let timestamp = (new Date()).valueOf();
    wx.chooseImage({
     success: chooseResult => {
       var index1=chooseResult.tempFilePaths[0].lastIndexOf(".");
       var index2=chooseResult.tempFilePaths[0].length;
       var type=chooseResult.tempFilePaths[0].substring(index1,index2);
       wx.showLoading({
        title: '上传中。。。',
       })
       // 将图片上传至云存储空间
       wx.cloud.uploadFile({
        // 指定上传到的云路径
        cloudPath: timestamp + type,
        // 指定要上传的文件的小程序临时文件路径
        filePath: chooseResult.tempFilePaths[0],
        // 成功回调
        success: res => {
         console.log('上传成功', res)
         wx.hideLoading()
         wx.showToast({
          title: '上传图片成功',
         })
         that.setData({
          gdetailspic: res.fileID,
          hasimg2:'上传成功',
          hasChangeImg2:true
         })       
        },
        })
    }
  })
  },
  changeflavor(e){
    console.log(e)
    let index = e.currentTarget.dataset.index
    let newflavor = this.data.flavor
    newflavor[index] = e.detail.value
    this.setData({
      flavor:newflavor
    })
  },
  changeName(e){
    this.setData({
      name:e.detail.value
    })
  },
  changebuyingprice(e){
    this.setData({
      buyingprice:e.detail.value
    })
  },
  //rule1
  changerule1price(e){
    let newrule = this.data.rule1
    newrule.price = e.detail.value
    this.setData({
      rule1:newrule
    })
  },
  changerule1name(e){
    let newrule = this.data.rule1
    newrule.name = e.detail.value
    this.setData({
      rule1:newrule
    })
  },
  changerule1min(e){
    let newrule = this.data.rule1
    newrule.minnum = e.detail.value
    this.setData({
      rule1:newrule
    })
  },
  changerule1max(e){
    let newrule = this.data.rule1
    newrule.maxnum = e.detail.value
    this.setData({
      rule1:newrule
    })
  },
  //rule2
  changerule2price(e){
    let newrule = this.data.rule2
    newrule.price = e.detail.value
    this.setData({
      rule2:newrule
    })
  },
  changerule2name(e){
    let newrule = this.data.rule2
    newrule.name = e.detail.value
    this.setData({
      rule2:newrule
    })
  },
  changerule2min(e){
    let newrule = this.data.rule2
    newrule.minnum = e.detail.value
    this.setData({
      rule2:newrule
    })
  },
  changerule2max(e){
    let newrule = this.data.rule2
    newrule.maxnum = e.detail.value
    this.setData({
      rule2:newrule
    })
  },
  //rule3
  changerule3price(e){
    let newrule = this.data.rule3
    newrule.price = e.detail.value
    this.setData({
      rule3:newrule
    })
  },
  changerule3name(e){
    let newrule = this.data.rule3
    newrule.name = e.detail.value
    this.setData({
      rule3:newrule
    })
  },
  changerule3min(e){
    let newrule = this.data.rule3
    newrule.minnum = e.detail.value
    this.setData({
      rule3:newrule
    })
  },
  changerule3max(e){
    let newrule = this.data.rule3
    newrule.maxnum = e.detail.value
    this.setData({
      rule3:newrule
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id != 'undefined'){
      this.setData({
        isUpdate : true,
        goodsid : options.id
      })
      this.getGoods()
    }else{
      this.getCategory()
    }
    // this.getGoods()
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