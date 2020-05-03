const app = getApp()
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    inpuVal: "",//input框内值
    listarr: [],//创建数组
    SearchText: '取消',//按钮变动值
    keydown_number: 0,//检测input框内是否有内容
    input_value: "",//value值
    hostarr: [],//热门搜索接收请求存储数组  
    name_focus:true//获取焦点
  },
  //取值input判断输入框内容修改按钮
  inputvalue: function (e) {
    this.setData({
      inputVal: e.detail.value,
      goods:[]
    })
    if (e.detail.cursor != 0) {
      this.setData({
        SearchText: "搜索",
        keydown_number: 1
      })
    } else {
      this.setData({
        SearchText: "取消",
        keydown_number: 0
      })
    }
  },
  //搜索方法
  search: function () {
    if (this.data.keydown_number == 1) {
      let This = this;
      //把获取的input值插入数组里面
      let arr = this.data.listarr;
      console.log('输入的',this.data.inputVal)
      console.log(this.data.input_value)
      //判断取值是手动输入还是点击赋值
      if (this.data.input_value == ""){
        // console.log('进来第er个')
        this.getgoods(this.data.inputVal)
        // 判断数组中是否已存在
        let arrnum = arr.indexOf(this.data.inputVal);
        console.log(arr.indexOf(this.data.inputVal));
        if (arrnum != -1) {
          // 删除已存在后重新插入至数组
          arr.splice(arrnum,1)
          arr.unshift(this.data.inputVal);
 
        }else{
          arr.unshift(this.data.inputVal);
        }
      
      } else  {
        console.log('进来第一个')
        this.getgoods(this.data.input_value)
        let arr_num = arr.indexOf(this.data.input_value);
        console.log(arr.indexOf(this.data.input_value));
        if (arr_num != -1) {
          arr.splice(arr_num, 1)
          arr.unshift(this.data.input_value);
        } else {
          arr.unshift(this.data.input_value);
        }
 
      }
      console.log(arr)
      
      //存储搜索记录
      wx.setStorage({
        key: "list_arr",
        data: arr
      })
 
    
      //取出搜索记录
      wx.getStorage({
        key: 'list_arr',
        success: function (res) {
          This.setData({
            listarr: res.data
          })
        }
      })
      this.setData({
        input_value: '',
        SearchText: "取消",
        keydown_number: 0
      })
    } else {
      wx.navigateBack({
        delta: 1,  // 返回上一级页面。
        complete: (res) => {
          console.log(res)
        },
      })
    }
 
  },
  //清除搜索记录
  delete_list: function () {
    //清除当前数据
    this.setData({
      listarr: []
    });
    //清除缓存数据
    wx.removeStorage({
      key: 'list_arr'
    })
  },
  //点击赋值到input框
  this_value:function(e){
    this.setData({
      name_focus: true
    })
    let value = e.currentTarget.dataset.text;
    this.setData({
      input_value:value,
      SearchText: "搜索",
      keydown_number: 1
    })
  },
  getgoods:function(e){
    var inputmsg = "";
    inputmsg = e;
    var good = "";
    if(inputmsg!=''){
    app.globalData.db.collection('goods').where({
      name:{								//columnName表示欲模糊查询数据所在列的名
        $regex:'.*' + inputmsg + '.*',		//queryContent表示欲查询的内容，‘.*’等同于SQL中的‘%’
        $options: 'i'							//$options:'1' 代表这个like的条件不区分大小写,详见开发文档
      }
    }).get().then((res)=>{
      good = res.data
      console.log(res)
      this.setData({
        //id: ids,  //把获取的自定义id赋给当前组件的id(即获取当前组件)  
        goods: good
      })
    })
  } 
  },
  turnmsg:function(e){
    // console.log(e.currentTarget.dataset.id)
    let theTurnID = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './../details/details?id='+theTurnID
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    let This = this;
    //设置当前页标题
    wx.setNavigationBarTitle({
      title: '搜索'
    });
    //读取缓存历史搜索记录
    wx.getStorage({
      key: 'list_arr',
      success: function (res) {
        This.setData({
          listarr: res.data
        })
      }
    })
    //请求热门搜索
    // wx.request({
    //   url: 'http://192.168.1.222:8081/StaticPage/list.json', //仅为示例，并非真实的接口地址
    //   method: 'GET',
    //   data: {},
    //   success: function (res) {
    //     This.setData({
    //       hostarr: res.data.History
    //     })
    //   },
    //   fail: function (err) {
    //     console.log(err)
    //   }
    // })
 
 
 
  },
})