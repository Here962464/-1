var app =getApp();
var albumUrl = app.globalData.globalAlbumUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    albumName:"",
    imgSrc:"",
    photoName:"",
    photoDescribe:"",
    addTime:"",
    screenHeight:"",
    screenWidth:"",
    figerDirection:"",
    startX:0,
    moveX:0,
    X:0,
    total:0,
    index:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 加载照片总数
    this.setData({
      total: app.globalData.photoTotal,
      albumName: app.globalData.albumName,
      index: app.globalData.curIndex+1
    })

    wx.showToast({
      title: '加载中...',
      duration:10000,
      icon:"loading"
    })

    var _this = this;
    // 获取可视窗口宽高
    wx.getSystemInfo({
      success: function(res) {
        console.log(res);
        _this.setData({
          screenHeight: res.screenHeight,
          screenWidth: res.screenWidth
        })
      },
    })
    this.loadImg();
  },
  figerTouchStart: function(e){
    console.log(e);
    // 按下时更新坐标
    this.data.startX = e.touches[0].pageX;
  },
  figerMove: function(e){
    console.log(e)
    // 移动时更新坐标
    this.data.moveX = e.touches[0].pageX;
    // 移动时计算坐标差值
    this.data.X = this.data.moveX - this.data.startX;
  },
  figerTouchEnd: function () {
    var tempTotal = this.data.total
    var _this = this;
    // 判断
    // 如果X<0，则向左移动，如果X>0，则向右移动
    if (_this.data.X < 0) {
      _this.data.index++;
      if (_this.data.index <= tempTotal){
        _this.loadImg();
      }else{
        _this.data.index = tempTotal;
      }
      console.log(_this.data.index) 
    } else{
      _this.data.index--;
      if (_this.data.index > 0) {
        _this.loadImg();
      }else{
        _this.data.index = 1;
      }
      console.log(_this.data.index) 
    }
  },
  loadImg: function(){
    var _this = this;
    console.log(this.data.index)
    // 发请求
    // 获取照片信息
    var map = {};
    //当前页号
    map['pageNum'] = this.data.index;
    //每页显示的数据条数
    map['pageSize'] = 1;
    //查询已经删除的照片（回收站）时  del=1， 不加默认都查询
    map['del'] = 0;
    //输入相册id  查询的结果是该相册内的数据
    map['albumId'] = app.globalData.albumId;
    //列排序  按照时间降序 DESC  升序 ASC  不加默认按时间降序
    map['arrange'] = "DESC";

    var mapString = JSON.stringify(map).slice(1);
    var value = mapString.substr(0, mapString.length - 1);
    wx.request({
      url: albumUrl +'wx_photo/selectPhotoPageList?value=' + value,
      success: function (res) {
        wx.hideToast();
        console.log(res);
        var tempArry = res.data.value.list[0];
        _this.setData({
          imgSrc: tempArry.photoPath,
          photoDescribe: tempArry.photoDescribe,
          photoName: tempArry.photoName
        })
      }
    })
  }
})