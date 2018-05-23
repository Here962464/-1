var app = getApp();
var resourceUrl = app.globalData.globalResourceUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollY: "",
    pageSize: 20,
    total: 0,
    baseline: false,
    fileList:[],
    folderList:[],
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    // 获取设备高度
    wx.getSystemInfo({
      success: function(res) {
        console.log(res);
        _this.setData({
          scrollY: res.windowHeight
        })
      },
    })
    var tempSize = this.data.pageSize;
    this.readyToLoad(tempSize);
    var tempUserInfo = {};
    //获取用户信息
    wx.getUserInfo({
      success: function(res){
        console.log(res);
        tempUserInfo.avatarUrl = res.userInfo.avatarUrl;
        tempUserInfo.nickName = res.userInfo.nickName;
        _this.setData({
          userInfo: tempUserInfo
        })
      }
    })
  },
  // 默认加载
  readyToLoad: function (pageSize) {
    var _this = this;
    var map = {};
    //当前页号
    map['pageNum'] = 1;
    //每页显示的数据条数
    map['pageSize'] = pageSize;
    //父级目录id  如果是没有父级目录，而是刚进入文件模块的列表，就空着。
    //如果是进入某个文件夹，则填写该文件夹的id
    map['parentId'] = "root";
    //列排序  按照时间降序 DESC  升序 ASC  不加默认按时间降序
    map['arrange'] = "DESC";
    var mapString = JSON.stringify(map).slice(1);
    var value = mapString.substr(0, mapString.length - 1);
    wx.request({
      url: resourceUrl + 'wx_resource/ResourceList?value=' + value,
      success: function (res) {
        wx.hideToast();
        console.log(res.data);
        _this.data.total = res.data.value.total;
        var tempFolderList = [];
        var temFileFolder = [];
        var tempResArray = res.data.value.list;
        for (var i = 0; i < tempResArray.length; i++){
          if (tempResArray[i].folder == 1){
            // 如果是文件夹
            tempResArray[i]["imgUrl"] = "../../../../icon/folder.png";
            tempResArray[i]["computedFileSize"] = "";
            tempFolderList.push(tempResArray[i]);
          } else{
            // 如果是其他文件
            var filter = tempResArray[i].fileName;
            // 正则匹配
            var pattTxt = /^.*txt$/;
            var pattDocx = /^.*docx$/;
            var pattHtml = /^.*html$/;
            var pattPdf = /^.*pdf$/;
            var pattJs = /^(.*js|.*css|.*php)$/;
            var pattZip = /^(.*zip|.*rar)$/;
            var pattImg = /^(.*jpg|.*png|.*gif|.*jpeg|.*bmp|.*ico|.*icl|.*psd|.*tif)$/;
            // console.log(filter.match(patt1));
            if (filter.match(pattTxt)){
              tempResArray[i]["imgUrl"] = "../../../../icon/txt.png";
              var tempSize = tempResArray[i].fileSize;
              // 判断文件大小
              if(tempSize == null){
                tempResArray[i]["computedFileSize"] ="0kb";
              }else{
                tempResArray[i]["computedFileSize"] = tempSize + "kb";
              }
              tempFolderList.push(tempResArray[i]);
            } else if (filter.match(pattDocx)){
              tempResArray[i]["imgUrl"] = "../../../../icon/wordFile.png";
              var tempSize = tempResArray[i].fileSize;
              // 判断文件大小
              if (tempSize == null) {
                tempResArray[i]["computedFileSize"] = "0kb";
              } else {
                tempResArray[i]["computedFileSize"] = tempSize + "kb";
              }
              tempFolderList.push(tempResArray[i]);
            } else if (filter.match(pattHtml)) {
              tempResArray[i]["imgUrl"] = "../../../../icon/html.png";
              var tempSize = tempResArray[i].fileSize;
              // 判断文件大小
              if (tempSize == null) {
                tempResArray[i]["computedFileSize"] = "0kb";
              } else {
                tempResArray[i]["computedFileSize"] = tempSize + "kb";
              }
              tempFolderList.push(tempResArray[i]);
            } else if (filter.match(pattPdf)) {
              tempResArray[i]["imgUrl"] = "../../../../icon/PDF.png";
              var tempSize = tempResArray[i].fileSize;
              // 判断文件大小
              if (tempSize == null) {
                tempResArray[i]["computedFileSize"] = "0kb";
              } else {
                tempResArray[i]["computedFileSize"] = tempSize + "kb";
              }
              tempFolderList.push(tempResArray[i]);
            } else if (filter.match(pattJs)) {
              tempResArray[i]["imgUrl"] = "../../../../icon/codeFile.png";
              var tempSize = tempResArray[i].fileSize;
              // 判断文件大小
              if (tempSize == null) {
                tempResArray[i]["computedFileSize"] = "0Kb";
              } else {
                tempResArray[i]["computedFileSize"] = tempSize + "Kb";
              }
              tempFolderList.push(tempResArray[i]);
            } else if (filter.match(pattZip)) {
              tempResArray[i]["imgUrl"] = "../../../../icon/zip.png";
              var tempSize = tempResArray[i].fileSize;
              // 判断文件大小
              if (tempSize == null) {
                tempResArray[i]["computedFileSize"] = "0kb";
              } else {
                tempResArray[i]["computedFileSize"] = tempSize + "kb";
              }
              tempFolderList.push(tempResArray[i]);
            } else if (filter.match(pattImg)){
              tempResArray[i]["imgUrl"] = "../../../../icon/imgFile.png";
              var tempSize = tempResArray[i].fileSize;
              // 判断文件大小
              if (tempSize == null) {
                tempResArray[i]["computedFileSize"] = "0kb";
              } else {
                tempResArray[i]["computedFileSize"] = tempSize + "kb";
              }
              tempFolderList.push(tempResArray[i]);
            }else{
              tempResArray[i]["imgUrl"] = "../../../../icon/document.png";
              var tempSize = tempResArray[i].fileSize;
              // 判断文件大小
              if (tempSize == null) {
                tempResArray[i]["computedFileSize"] = "0kb";
              } else {
                tempResArray[i]["computedFileSize"] = tempSize + "kb";
              }
              tempFolderList.push(tempResArray[i]);
            }
          }
        }
        console.log(tempFolderList);
        _this.setData({
          folderList: tempResArray
        })
      }
    })
  },
  _upload: function(){
    // wx.getSavedFileList({
    //   success: function(res){
    //     console.log(res);
    //   }
    // })
    wx.chooseImage({
      success: function(res) {
        console.log(res);
      },
    })
    // wx.uploadFile({
    //   url: resourceUrl + "saveResource",
    //   filePath: '',
    //   name: '',
    //   success: function (res){
    //     console.log(res)
    //   }
    // })
  },
  // 判断边界值开始加载下一页
  startLoading: function (e) {
    console.log(e)
    var _this = this;
    var num = this.data.pageSize += 20;
    var upperLimit = this.data.total + 20;
    if (num < upperLimit) {
      wx.showToast({
        title: '加载中',
        icon:"loading",
        duration:10000
      })
      this.readyToLoad(_this.data.pageSize);
    } else {
      _this.setData({
        baseline: true
      })
    }
  }
})