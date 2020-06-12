// pages/updateGoods/updateGoods.js
import WeCropper from '../../utils/we-cropper/we-cropper.js'
const device = wx.getSystemInfoSync()
const util = require('../../utils/util.js')
const width = device.windowWidth
const height = device.windowHeight - 100;
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
    ruleID:[],
    goodscount:0,
    picno:0,
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
  
  chooseImage: function (e) {
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
                goodspic: res.fileID,
                hasimg1:'上传成功',
                hasChangeImg1:true
              }) 
            }else if(that.data.picno=='2'){
              that.setData({
                gdetailspic1: res.fileID,
                hasimg2:'上传成功',
                hasChangeImg2:true
               })  
            }else if(that.data.picno=='3'){
              that.setData({
                gdetailspic2: res.fileID,
                hasimg3:'上传成功',
                hasChangeImg3:true
               })  
            }else if(that.data.picno=='4'){
              that.setData({
                gdetailspic3: res.fileID,
                hasimg4:'上传成功',
                hasChangeImg4:true
               })  
            }
            // var data = res.data;   //  json 格式转换成对象，要看后端返回给你什么格式，我这里后端给的json格式的所以要转
            // console.log(res)
            // that.setData({
            //   path: data.msg,
            // });
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
  goodsmsgchange(e){
    console.log(e.detail.value)
    this.setData({
      goodsmsg:e.detail.value
    })
  },
  getCategory(){
    app.globalData.db.collection('CATEGORY').get().then((res)=>{
      let newitems = []
      for(var i=0;i<res.data.length;i++){
        let params = {}
        let num = String(i+1)
        console.log('length',num.length)
        for(var j=0;j<=(3-num.length);j++){
          num = '0'+num
        }
        if(!!this.data.catgory){
          let choose = this.data.catgory.indexOf(num) != -1
          params = {name:num,value:res.data[i].name,checked:choose}
        }else{
          params = {name:num,value:res.data[i].name}
        }  
        newitems.push(params)
      }
      this.setData({
        items:newitems
      })
      console.log(this.data.items)
    })
  },
  changegoodscount(e){
    this.setData({
      goodscount:e.detail.value
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
        gdetailspic1:res.data[0].gdetailspic1,
        gdetailspic2:res.data[0].gdetailspic2,
        gdetailspic3:res.data[0].gdetailspic3,
        goodspic:res.data[0].goodspic,
        buyingprice:res.data[0].buyingprice,
        goodsmsg:res.data[0].goodsmsg,
        goodscount:res.data[0].goodscount,
        time:res.data[0].time
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
    let nn = {flavor:'',count:0}
    newflavor.push(nn);
    console.log(newflavor)
    this.setData({
      flavor:newflavor
    })
  },
  deleteflavor(e){
    console.log(e)
    let thekey = 0;
    for(var i = 0;i<this.data.flavor.length;i++){
      if(this.data.flavor[i].flavor==e.currentTarget.dataset.id){
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
    console.log('allprice',allprice)
    app.globalData.db.collection('rule').where({
      goodsid:this.data.goodsid,
      price:allprice
    }).orderBy('price', 'desc').get().then((res)=>{
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
    let flavorcheck = true
    if(!!_this.data.flavor.length){
      for(var i=0;i<_this.data.flavor.length;i++){
        if(!!_this.data.flavor[i].flavor&&_this.data.flavor[i].count!=0){
          flavorcheck = true
        }else{
          flavorcheck = false;
          break;
        }
      }
    }else{
      console.log('noflavor')
      console.log(_this.data.goodscount)
      if(Number(_this.data.goodscount)!=0){
        flavorcheck = true
      }else{
        flavorcheck = false;
      }
    }
    if(!!_this.data.catgory&&!!_this.data.name&&!!_this.data.goodspic&&!!_this.data.gdetailspic1&&!!_this.data.gdetailspic2&&!!_this.data.gdetailspic3&&!!_this.data.rule1.price&&!!_this.data.rule1.name&&!!_this.data.rule1.minnum&&!!_this.data.rule1.maxnum&&!!_this.data.rule2.price&&!!_this.data.rule2.name&&!!_this.data.rule2.minnum&&!!_this.data.rule2.maxnum&&!!_this.data.rule3.price&&!!_this.data.rule3.name&&!!_this.data.rule3.minnum&&!!_this.data.rule3.maxnum&&!!_this.data.buyingprice&&flavorcheck){
      if(this.data.isUpdate==true){
        this.updateGoods();
      }else{
        this.insertGoods()
      }
    }else{
      wx.showToast({
        title: '存在值为空',
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
    let time = util.formatTime(new Date())
    app.globalData.db.collection('goods').add({
      data:{
        catgory: _this.data.catgory,
        flavor: _this.data.flavor,
        goodspic: _this.data.goodspic,
        gdetailspic1:_this.data.gdetailspic1,
        gdetailspic2:_this.data.gdetailspic2,
        gdetailspic3:_this.data.gdetailspic3,
        name: _this.data.name,
        price1: _this.data.rule1.price,
        price2: _this.data.rule2.price,
        price3: _this.data.rule3.price,
        buyingprice:_this.data.buyingprice,
        goodsmsg:_this.data.goodsmsg,
        goodscount:_this.data.goodscount,
        time:time
      }
    }).then((res)=>{
      console.log(res._id)
      _this.insertrule(res._id,_this.data.rule1,'商品单价：');
      _this.insertrule(res._id,_this.data.rule2,'批发单价：');
      _this.insertrule(res._id,_this.data.rule3,'二批单价：');
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
  insertrule(id,rule,levelname){
    app.globalData.db.collection('rule').add({
      data:{
        goodsid:id,
        maxnum:rule.maxnum,
        minnum:rule.minnum,
        name:rule.name,
        price:rule.price,
        levelname:levelname
      }
    }).then((res)=>{
      console.log(res)
    })
  },
  updateGoods(){
    let _this = this
    let theid = _this.data.goodsid
    let time = util.formatTime(new Date())
    wx.cloud.callFunction({
      name: "setMsg",
      data: {
        id:theid,
        collection:'goods',
        data:{
              catgory: _this.data.catgory,
              flavor: _this.data.flavor,
              goodspic: _this.data.goodspic,
              gdetailspic1:_this.data.gdetailspic1,
              gdetailspic2:_this.data.gdetailspic2,
              gdetailspic3:_this.data.gdetailspic3,
              name: _this.data.name,
              price1: _this.data.rule1.price,
              price2: _this.data.rule2.price,
              price3: _this.data.rule3.price,
              buyingprice:_this.data.buyingprice,
              goodsmsg:_this.data.goodsmsg,
              goodscount:_this.data.goodscount,
              time:_this.data.time
            }
      }
    }).then((res)=>{
      console.log(res)
        _this.updaterule(_this.data.rule1._id,_this.data.rule1,'商品单价：');
        _this.updaterule(_this.data.rule2._id,_this.data.rule2,'批发单价：');
        _this.updaterule(_this.data.rule3._id,_this.data.rule3,'二批单价：');
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
  updaterule(id,rule,levelname){
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
          price:rule.price,
          levelname:levelname
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
          gdetailspic1: res.fileID,
          hasimg2:'上传成功',
          hasChangeImg2:true
         })       
        },
        })
    }
  })
  },
  changepic3(){
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
          gdetailspic2: res.fileID,
          hasimg3:'上传成功',
          hasChangeImg3:true
         })       
        },
        })
    }
  })
  },
  changepic4(){
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
          gdetailspic3: res.fileID,
          hasimg4:'上传成功',
          hasChangeImg4:true
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
    newflavor[index].flavor = e.detail.value
    this.setData({
      flavor:newflavor
    })
  },
  changeflavorcount(e){
    console.log(e)
    let index = e.currentTarget.dataset.index
    let newflavor = this.data.flavor
    newflavor[index].count = e.detail.value
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
    if(options.id != 'undefined'){
      this.setData({
        isUpdate : true,
        goodsid : options.id
      })
      this.getGoods()
    }else{
      this.getCategory()
    }
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