var app = getApp();
var albumUrl = app.globalData.globalAlbumUrl;
var fileUrl = app.globalData.globalFileUrl;
Page({
  data: {
    upLoadUrl:"",
    imgUrl:"",
    isReady:true,
    photoInfo:{
      imgwidth:0,
      imgheight:0,
      imgtype:"",
      imgsize:0
    }
  },
  chooseImg: function(){
    var _this = this;
    wx.chooseImage({
      count:9,
      success: function(res) {
        var tempUrl = res.tempFilePaths[0];
        console.log(res);
        _this.setData({
          imgUrl: tempUrl, 
          photoInfo: {
            imgsize: res.tempFiles[0].size
          }
        });
        wx.showToast({
          title: '正在加载...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })  
        // 获取照片信息
        wx.getImageInfo({
          src: tempUrl,
          success: function (res) {
            console.log(res);
            _this.setData({
              photoInfo: {
                imgwidth: res.width,
                imgheight: res.height,
                imgtype: res.type
              }
            })
          }
        })
        // 上传图片到服务器
        wx.uploadFile({
          url: fileUrl + 'file/upload',
          filePath: tempUrl,
          name: 'file',
          formData: {
            'file': tempUrl
          },
          success: function (res) {
            console.log(res);
            //上传成功，隐藏加载动画
            wx.hideToast();
            // 顺给我返回的是一个字符串，不是json  所以转换了一下
            var temp = JSON.parse(res.data)
            // var tempArry = [];
            // tempArry.push(temp)
            // console.log(tempArry);
            _this.setData({
              upLoadUrl: temp.value,
              isReady:false
            })
          },
          fail: function (res) {
            console.log(res)
          }
        })
      },
    })
  },
  uploadPhoto: function (e) {
    var _this = this;
    // 上传到相册
    var map = {};
    //相册ID
    map['albumId'] = app.globalData.albumId;
    console.log(app.globalData.albumId)
    //照片名称
    map['photoName'] = "我的logo";
    //照片类型
    map['photoType'] = this.data.photoInfo.imgtype;
    //照片大小
    map['photoSize'] = this.data.photoInfo.imgsize;
    //照片高
    map['photoHeight'] = this.data.photoInfo.imgheoght;
    //照片宽
    map['photoWidth'] = this.data.photoInfo.imgwidth;
    //照片名称
    map['photoName'] = "nihao";
    //照片描述
    map['photoDescribe'] = "hah";
    //照片路径
    map['photoPath'] = _this.data.upLoadUrl;
    var mapString = JSON.stringify(map).slice(1);
    var value = mapString.substr(0, mapString.length - 1);
    wx.uploadFile({
      url: albumUrl +'wx_photo/addPhoto?value=' + value,
      filePath: _this.data.imgUrl,
      name: 'file',
      formData: {
        'file': value
      },
      success: function (res) {
        console.log(res);
        wx.hideToast();
        wx.showToast({
          title: '上传成功！',
          icon: "success",
          duration: 2000
        })
        setTimeout(function(){
          // 页面重定向
          wx.redirectTo({
            url: '../photoes',
          })
        },2000)
      },
      fail: function (res) {
        console.log(res)
      }
    })
  }
})