var app = getApp();
var photoUrl = app.globalData.globalPhotoUrl;
var albumUrl = app.globalData.globalAlbumUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasAlbum:{
      messeage:"",
      has:0
    },
    scrollY:"",
    pageSize:8,
    total:0,
    baseline:false,
    userInfo:{}
  },
  menu: function(e){
    console.log(e);
    app.globalData.albumId = e.currentTarget.id;
    wx.navigateTo({
      url: 'resetAlbum/resetAlbum',
    })
  },
  addAlbum: function(){
    wx.navigateTo({
      url: 'addAlbum/addAlbum'
    })
  },
  readyToLoad: function (pageSize){
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 10000
    })
    var _this = this;
    var map = {};
    //当前页号
    map['pageNum'] = 1;
    //每页显示的数据条数
    map['pageSize'] = pageSize;
    //查询存在的相册列表，如果查询回收站里的列表 isDel=1 
    map['isDel'] = 0;
    var mapString = JSON.stringify(map).slice(1);
    var value = mapString.substr(0, mapString.length - 1);
    wx.request({
      url: albumUrl + 'wx_album/albumList?value=' + value ,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res);
        wx.hideToast();        
        var code = res.data.code;
        console.log(res.data);
        if (code == 1) {
          // 获取到数据，显示相册列表
          _this.setData({
            hasAlbum: {
              message: res.data.value.list,
              has: 1
            },
            total: res.data.value.total
          })
        } else if (code == -1) {
          _this.setData({
            hasAlbum: {
              message: "您暂时还没有相册哟，点击添加相册，上传精美图片~",
              has: 0
            }
          })
        } else if (code == -4) {
          _this.setData({
            hasAlbum: {
              message: "相册获取失败"
            }
          })
        }
      }
    })
  },
  // 打开相册
  albumDetail: function(e){
    var tempId = e.currentTarget.id;
    app.globalData.albumId = tempId;
    // 根据ID获取相册名称
    wx.request({
      url: albumUrl +'wx_album/selectAlbumById?value=' + tempId,
      success: function(res){
        console.log(res);
        var tempName = res.data.value.albumName;
        app.globalData.albumName = tempName;
      }
    })
    console.log(app.globalData.albumId)
    wx.navigateTo({
      url: 'photoes/photoes'
    })
  },
  // 添加相册
  addNewAlbum: function(){
    wx.navigateTo({
      url: 'addAlbum/addAlbum',
    })
  },
  // 判断边界值开始加载下一页
  startLoading: function(e){
    var _this = this;
    var num = this.data.pageSize +=8;
    var upperLimit = this.data.total+8;
    if (num < upperLimit){
      this.readyToLoad(_this.data.pageSize);
    }else{
      _this.setData({
        baseline:true
      })
    }
  },
  onShow: function(){
    this.onLoad();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.getSystemInfo({
      success: function(res) {
        console.log(res.windowHeight);
        _this.setData({
          scrollY: res.windowHeight
        })
      },
    })
    this.readyToLoad(_this.data.pageSize);
    var tempUserInfo = {};
    //获取用户信息
    wx.getUserInfo({
      success: function (res) {
        console.log(res);
        tempUserInfo.avatarUrl = res.userInfo.avatarUrl;
        tempUserInfo.nickName = res.userInfo.nickName;
        _this.setData({
          userInfo: tempUserInfo
        })
      }
    })
  }
})