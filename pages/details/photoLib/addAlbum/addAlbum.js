var app = getApp();
var tempArry = [];
var tempUnique = [];
var deleteIndex;
var albumUrl = app.globalData.globalAlbumUrl;
var fileUrl = app.globalData.globalFileUrl;
Page({
  data: {
    toAddTips: false,
    pubState: 1,
    psdState: 0,
    psdBackground: "rgb(245,247,250)",
    psdFocus: false,
    coverUrl:"",
    nameMention:"",
    nameState:false,
    descripMention: "",
    descripState: false,
    unique: [],
    tipsValue: [],
    warnText: false,
    albumSort:"",
    description:"",
    albumName:"",
    privacySet:0,
    setPassword:0,
    albumPassword:"",
    albumIcon:"",
    iconPath:""
  },
  albumName: function(e){
    var iptContent = e.detail.value;
    var _this = this;
    if (iptContent==""){
      this.setData({
        nameMention:"相册名不能为空!",
        nameState: false
      })
    }else{
      // 方便提交表单时验证！
      _this.setData({
        nameState: true,
        albumName: iptContent
      })
    }
  },
  albumDescription: function(e){
    var iptContent = e.detail.value;
    var _this = this;
    if (iptContent=="") {
      this.setData({
        descripMention: "相册描述不能为空!",
        descripState: false
      })
    } else {
      // 方便提交表单时验证！
      _this.setData({
        descripState: true,
        description: iptContent
      })
    }
  },
  // 是否公开
  privacy: function(e){
    var privacySet = e.detail.value;
    console.log(privacySet);
    if (privacySet){
    console.log(1)
      this.setData({
        pubState: 1
      })
    }else{
      console.log(0)
      this.setData({
        pubState: 0
      })
    }
  },
  addTips: function(){
    this.setData({
      toAddTips:true
    })
  },
  startDelete: function(e){
    // 给tips里的每一个×添加一个ID ，ID的内容为tips的内容，当用户点击×时for循环tempArry数组，判断ID与数组里的哪一个值相等，寻找这个值的index值并赋给一个变量，删除tempArry里相应的值，并重新渲染tips列表
    var _index = e.target.id
    console.log(_index);
    for (var i=0;i<tempArry.length;i++){
      if (_index == tempArry[i]){
        deleteIndex = i;
      }
    }
    tempArry.splice(deleteIndex, 1);
    this.setData({
      tipsValue: tempArry
    })
  },
  psdProtection: function(e){
    if(e.detail.value){
      this.setData({
        psdState: false,
        psdBackground: "#fff",
        psdFocus: true,
          setPassword: 1
      })
    }else{
      this.setData({
        psdState: true,
        psdBackground: "rgb(245,247,250)",
        psdFocus: false,
          setPassword: 0
      })
    }
  },
  getPsd: function(e){
    var psd = e.detail.value;
    this.setData({
        albumPassword: psd
    })
  },
  subTipsContent: function(e){
    var _this = this;
    var tempContent = e.detail.value;
    if (tempContent != ""){
      for (var i = 0; i < tempArry.length; i++) {
        if (tempContent == tempArry[i]) {
          console.log(tempArry[i]);
          tempArry.pop();
          _this.setData({
            warnText:true
          });
          setTimeout(function(){
            _this.setData({
              warnText: false
            })
          },2000);
        }
      }
      tempArry.push(tempContent);
    }
    this.setData({
      toAddTips: false,
      tipsValue:tempArry,
      unique:tempUnique
    })
  },
  chooseCover: function(){
    var _this = this;
    // 选择封面
    wx.chooseImage({
      count:1,
      success: function(res) {
        wx.showToast({
          title: '封皮上传中...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })  
        var tempFilePaths = res.tempFilePaths[0];
        _this.setData({
          coverUrl: tempFilePaths
        })
        console.log(tempFilePaths);
        // 将封面存到服务器
        wx.uploadFile({
          url: fileUrl +'file/upload', 
          filePath: tempFilePaths,
          name: 'file',
          formData: {
            'file': tempFilePaths
          },
          success: function (res) {
            wx.hideToast();
            // 顺给我返回的是一个字符串，不是json  所以转换了一下
            wx.showToast({
              title: '封皮上传成功！',
              icon:"success"
            })
            var temp = JSON.parse(res.data)
            console.log(temp)
            console.log(res)
            _this.setData({
              iconPath: temp.value
            })
            console.log(_this.data.iconPath)
          },
          fail: function(res){
            console.log(res)
          }
        })
        // 判断是否有封面
        var tempUrl = _this.data.coverUrl;
        var tempalbumIcon = _this.data.albumName;
        if (tempUrl == "") {
          _this.setData({
            albumIcon: "default"
          })
        } else {
          _this.setData({
            albumIcon: tempalbumIcon
          })
        }
      },
    })
  },
  // 请求创建文件夹
  formSubmit: function(e){
    var map = {};
    // 数组转字符串
    var albumSort = tempArry.toString();
    console.log(albumSort);
    map['albumSort'] = albumSort;
    map['description'] = this.data.description;
    console.log(this.data.description)
    //相册名称
    map['albumName'] = this.data.albumName;
    console.log(this.data.albumName)
    //相册权限（公开/隐藏）1公开 0隐藏（仅自己可看）
    map['privacySet'] = this.data.pubState;
    //是否设置相册密码  1设置 0不设置
    map['setPassword'] = this.data.setPassword;
    //相册密码
    if (this.data.setPassword){
      map['albumPassword'] = this.data.albumPassword;
    }else{
      console.log("没有设置密码")
    }
    //相册封面图标标识   如果用户没有自定义封面 设置为"default"
    map['albumIcon'] = this.data.albumIcon;
    //相册封面图标路径 url             
    map['iconPath'] = this.data.iconPath;
    map['showStyle'] = "特效一";

    //相册展示效果
    var mapString = JSON.stringify(map).slice(1);
    var value = mapString.substr(0, mapString.length - 1);

    var a = this.data.nameState;
    var b = this.data.descripState;
    if (!a && !b){
      this.setData({
        nameMention: "相册名不能为空!",
        descripMention: "相册描述不能为空!"
      })
    } else if (!a){
      this.setData({
        nameMention: "相册名不能为空!"
      })
    } else if (!b){
      this.setData({
        descripMention: "相册描述不能为空!"
      })
    }else if( a && b ){
      console.log(value);
      wx.request({
        url: albumUrl +'wx_album/createAlbum?value='+ value,
        method:"POST",
        success: function (res) {
          if (res.data.code==1){
            wx.showToast({
              title: "创建成功",
              icon: 'success',
              duration: 3000
            })
            setTimeout(function () {
              wx.navigateBack({
                url: '../photoLib',
              })
            }, 3000)
          } else if (res.data.code == -4){
            wx.showToast({
              title: "该相册已存在！",
              icon: 'loading',
              duration: 3000
            })
          }else{
            wx.showToast({
              title: "网络错误",
              icon: 'loading',
              duration: 3000
            })
          }
          console.log(res)
        },
        fail: function (res) {
          console.log('cuowu' + ':' + res)
        }
      })  
    }
  },
  backToPhotoLib: function(){
    console.log(111);
    wx.navigateBack();
  }
})