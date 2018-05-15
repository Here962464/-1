var app = getApp();
var photoUrl = app.globalData.globalPhotoUrl;
var albumUrl = app.globalData.globalAlbumUrl;
var fileUrl = app.globalData.globalFileUrl;
Page({
  data: {
    albumName:"",
    albumPassword:"",
    albumSort:"",
    description:"",
    iconPath:"",
    isDel:0,
    privacySet:0,
    setPassword:""
  },
  changeCover: function(){
    var _this = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        //加载动画
        wx.showToast({
          title: '加载中...',
          icon: 'loading',
          mask: true,
          duration: 10000
        });
        var tempFilePaths = res.tempFilePaths[0];
        // 更新本地封面
        _this.setData({
          iconPath: tempFilePaths
        });
        // 将封面存到服务器
        wx.uploadFile({
          url: fileUrl +'wx_file/upload',
          filePath: tempFilePaths,
          name: 'file',
          formData: {
            'file': tempFilePaths
          },
          success: function (res) {
            //上传成功，隐藏加载动画
            wx.hideToast();
            // 顺给我返回的是一个字符串，不是json  所以转换了一下
            var temp = JSON.parse(res.data);
            console.log(temp);
          },
          fail: function (res) {
            console.log(res)
          }
        })
      }
    })
  },
  confirmMessage: function(e){
    console.log(e);
    var map = {};
    //当前相册id  此项必填
    map['id'] = app.globalData.albumId;
    //以下信息 根据实际情况设置，比如只修改了 albumSort ，就只传map['albumSort']="xxx" 一个就可以，改哪个就传哪个 
    //修改相册描述
    map['description'] = this.data.description;
    //修改相册名称
    map['albumName'] = this.data.albumName;
    //修改相册权限（公开/隐藏）1公开 0隐藏（仅自己可看）
    //修改相册封面图标标识   如果用户没有自定义封面 设置为"default"
    map['albumIcon'] = "default";
    //修改相册封面图标路径 url
    map['iconPath'] = this.data.iconPath;
    
    var mapString = JSON.stringify(map).slice(1);
    var value = mapString.substr(0, mapString.length - 1);
    wx.request({
      url: albumUrl +'wx_album/updateAlbumInfo?value='+value,
      success: function(res){
        console.log(res);
        wx.showToast({
          title: '修改成功！',
          duration:2000,
          icon:"success"
        })
        // 延时页面重定向
        setTimeout(function(){
          wx.redirectTo({
            url: '../photoLib'
          })
        },2000)
      }
    })
  },
  albumName: function(e){
    console.log(e.detail.value);
    var tempName = e.detail.value;
    this.setData({
      albumName: tempName
    })
  },
  description: function(e){
    console.log(e.detail.value);
    var tempDescription = e.detail.value;
    this.setData({
      description: tempDescription
    })
  },
  backToPhotoLib: function(){
    wx.navigateBack({});
  },
  deleteAlbum: function(){
    var Id = app.globalData.albumId;
    wx.showModal({
      title: '删除相册',
      content: '确定删除本相册，并清空里面的所有照片',
      confirmText:"删除",
      success: function(res){
        if(res.confirm){
          wx.showToast({
            title: '删除中...',
            icon: "loading",
            duration: 10000
          })
          wx.request({
            url: albumUrl + 'wx_album/deleteAlbumById?value=' + Id,
            success: function (res) {
              wx.hideToast();
              if (res.data.code == 1) {
                wx.showToast({
                  title: '删除成功！',
                  icon: "success",
                  duration: 2000
                })
                console.log(res);
                // 延迟刷新相册
                setTimeout(function () {
                  wx.redirectTo({
                    url: '../photoLib',
                  })
                }, 2000)
              } else {
                wx.showToast({
                  title: '失败了o(╥﹏╥)o',
                  icon: "loading",
                  duration: 2000
                })
              }
            },
            fail: function (res) {

            }
          })
        }else{
          console.log("用户点击取消")
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    console.log(app.globalData.albumId);
    var Id = app.globalData.albumId;
    wx.request({
      url: albumUrl +'wx_album/selectAlbumById?value='+Id,
      success: function(res){
        console.log(res.data.value);
        var value = res.data.value;
        _this.setData({
          albumName: value.albumName,
          albumPassword: value.albumPassword,
          albumSort: value.albumSort,
          description: value.description,
          iconPath: value.iconPath,
          isDel: value.isDel,
          privacySet: value.privacySet,
          setPassword: value.setPassword,
        });
      }
    })
  }
})