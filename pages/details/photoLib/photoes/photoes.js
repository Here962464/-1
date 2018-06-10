var app = getApp();
var albumUrl = app.globalData.globalAlbumUrl;
Page({
  data: {
    hasPhoto: {
      messeage: "",
      has: false
    },
    scrollY: "",
    pageSize: 15,
    total: 0,
    baseline: false,
    upLoadUrl:"",
    select:"../../../icon/delete.png",
    display: "none",
    photoId:[]
  },
  menu: function(e){
    console.log(e);
    this.setData({
      display:"block",
    })
  },
  cancleDelete: function(){
    this.setData({
      display: "none",
    })
  },
  deletePhoto: function(e){
    var _this = this;
    var albumIdd = app.globalData.albumId;
    var Id = e.currentTarget.id;
    this.data.photoId.push(Id);
    console.log(albumIdd);
    console.log(this.data.photoId);
    var photoIdd = this.data.photoId.join(",");
    // albumId = xxxx & photoArrayList =xxxxx
    wx.showModal({
      title: '删除照片',
      content: '确定删除该照片',
      success: function(res){
        if(res.confirm){
          wx.request({
            url: albumUrl + 'wx_photo/deletePhoto?albumId=' + albumIdd + "&photoArrayList=" + photoIdd
            ,
            method: "POST",
            success: function (res) {
              wx.showToast({
                title: '删除成功！',
                duration: 1000,
                icon: "success"
              })
              // 延时刷新相册列表
              setTimeout(function () {
                console.log(res);
                _this.readyToLoad(_this.data.pageSize);
              }, 1000)
            }
          })
        }else{
          console.log("用户点击取消")
        }
      }
    })
    console.log(e)
    console.log(app.globalData.albumId);
  },
  getIndex: function(e){
    console.log(e.currentTarget.dataset.index);
    app.globalData.curIndex = e.currentTarget.dataset.index;
  },
  // 上传照片
  uploadPhoto: function(){
    wx.navigateTo({
      url: "addPhotoes/addPhotoes",
    })
  },
  readyToLoad: function (pageSize){
    var _this = this;
    var map = {};
    //当前页号
    map['pageNum'] = 1;
    //每页显示的数据条数
    map['del'] = 0;
    map['arrange'] = "DESC";
    map['pageSize'] = pageSize;
    //相册名称
    map['albumId'] = app.globalData.albumId;
    console.log(app.globalData.albumId)
    var mapString = JSON.stringify(map).slice(1);
    var value = mapString.substr(0, mapString.length - 1);
    wx.request({
      url: albumUrl +'wx_photo/selectPhotoPageList?value=' + value,
      method: "POST",
      success: function (res) {
        app.globalData.photoTotal = res.data.value.total;
        var list = res.data.value.list;
        if (res.data.value.total==0){
          wx.hideToast();
        }else{
          wx.hideToast();
          _this.setData({
            hasPhoto: {
              messeage: list,
              has: true
            },
            total: res.data.value.total
          });
        }
        console.log(res)
        // if(res.data.code==1){
        //   _this.setData({
        //     hasPhoto:{
        //       has:1
        //     }
        //   });
        // }
      }
    })
  },
  checkDetails: function(e){
    console.log(e);
    console.log(e.currentTarget.id)
    console.log(e.currentTarget.dataset.index)
    app.globalData.photoId = e.currentTarget.id;
    app.globalData.photoDetailsIndex = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: 'photoDetails/photoDetails',
    })
    this.setData({
      display: "none",
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    });
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight);
        _this.setData({
          scrollY: res.windowHeight
        })
      },
    })
    this.readyToLoad(_this.data.pageSize);
  },
  // 判断边界值开始加载下一页
  startLoading: function (e) {
    console.log(e)
    var _this = this;
    var num = this.data.pageSize += 15;
    var upperLimit = this.data.total + 15;
    if (num < upperLimit) {
      this.readyToLoad(_this.data.pageSize);
    } else {
      _this.setData({
        baseline: true
      })
    }
  }
})