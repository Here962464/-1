var app = getApp();
var resourceUrl = app.globalData.globalResourceUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 按需加载
    scrollY: "",
    pageSize: 20,
    total: 0,
    baseline: false,
    // 加载列表
    folderId:"root",
    backId: "root",
    folderList:[],
    userInfo: {},
    showFolder: false,
    iconSelect:"iconHide",
    selectedArray:[],
    // 新建文件夹
    parentId:"root",
    fileName:"",
    privacySet: 0,
    mentionFileName:"请输入文件夹名称",
    // 隐藏弹出层
    renameFolderState:true,
    newFolderState: true,
    // 进入子文件夹
    folderName:"",
    showBackArrow: false,
    idList: [],
    nameList: [],
    beforeIndex: 0,
    // 底部菜单栏
    tabBar:"ulBox",
    topBar:"topBar",
    chooseAmount:1,
    chooseAll:"全选",
    renameImgUrl:"../../../../icon/renameFolder.png",
    deleteImgUrl:"../../../../icon/deleteFolder.png",
    moveImgUrl:"../../../../icon/move.png",
    deleteFolder:"_deleteFolder",
    // 重命名
    mention:"请输入文件夹名称",
    oldFileName:"",
    newFolderName:"",
    oldFileId:"",
    oldFileType:"",
    // 移动到
    moveTo:"moveToHide"
  },
  onShow: function () {
    this.onLoad();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showToast({
      title: '加载中',
      icon:"loading",
      duration:10000
    })
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
    var tempId = this.data.folderId;
    this.readyToLoad(tempSize,tempId);
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
  readyToLoad: function (pageSize, parentId) {
    var _this = this;
    var map = {};
    //当前页号
    map['pageNum'] = 1;
    //每页显示的数据条数
    map['pageSize'] = pageSize;
    //父级目录id  如果是没有父级目录，而是刚进入文件模块的列表，就空着。
    //如果是进入某个文件夹，则填写该文件夹的id
    map['parentId'] = parentId;
    //是否被删除 0 未删除  1删除  1用于回收站查询  不写默认全查
    map['del'] = 0;
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
        var tempResArray = res.data.value.list;
        for (var i = 0; i < tempResArray.length; i++){
          // 加载icon的颜色
          tempResArray[i]["iconColor"] = "#ccc";
          // icon状态变量
          tempResArray[i]["selecteState"] = false;
          if (tempResArray[i].folder == 1){
            // 如果是文件夹
            // 图标
            tempResArray[i]["imgUrl"] = "../../../../icon/folder.png";
            // 大小
            tempResArray[i]["computedFileSize"] = "";
            // 点击事件类型
            tempResArray[i]["catchTapFn"] = "cdFolder";
            // ID名称
            tempResArray[i]["cdOrDownLoad"] = tempResArray[i].id;
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
              // 图标
              tempResArray[i]["imgUrl"] = "../../../../icon/txt.png";
              var tempSize = tempResArray[i].fileSize;
              // 判断文件大小
              if(tempSize == null){
                tempResArray[i]["computedFileSize"] ="0kb";
              }else{
                tempResArray[i]["computedFileSize"] = tempSize + "kb";
              }
              // 点击事件类型
              tempResArray[i]["catchTapFn"] = "uploadFile";
              // 下载路径
              tempResArray[i]["cdOrDownLoad"] = tempResArray[i].filePath;
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
              // 点击事件类型
              tempResArray[i]["catchTapFn"] = "uploadFile";
              // 下载路径
              tempResArray[i]["cdOrDownLoad"] = tempResArray[i].filePath;
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
              // 点击事件类型
              tempResArray[i]["catchTapFn"] = "uploadFile";
              // 下载路径
              tempResArray[i]["cdOrDownLoad"] = tempResArray[i].filePath;
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
              // 点击事件类型
              tempResArray[i]["catchTapFn"] = "uploadFile";
              // 下载路径
              tempResArray[i]["cdOrDownLoad"] = tempResArray[i].filePath;
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
              // 点击事件类型
              tempResArray[i]["catchTapFn"] = "uploadFile";
              // 下载路径
              tempResArray[i]["cdOrDownLoad"] = tempResArray[i].filePath;
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
              // 点击事件类型
              tempResArray[i]["catchTapFn"] = "uploadFile";
              // 下载路径
              tempResArray[i]["cdOrDownLoad"] = tempResArray[i].filePath;
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
              // 点击事件类型
              tempResArray[i]["catchTapFn"] = "uploadFile";
              // 下载路径
              tempResArray[i]["cdOrDownLoad"] = tempResArray[i].filePath;
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
              // 点击事件类型
              tempResArray[i]["catchTapFn"] = "uploadFile";
              // 下载路径
              tempResArray[i]["cdOrDownLoad"] = tempResArray[i].filePath;
              tempFolderList.push(tempResArray[i]);
            }
          }
        }
        console.log(tempFolderList);
        if (tempFolderList.length == 0){
          _this.setData({
            showFolder: false
          })
        }else{
          _this.setData({
            showFolder: true,
            folderList: tempResArray
          })
        }
      }
    })
  },
  // 下载文件
  uploadFile:function(e){
    console.log(e.currentTarget.id)
    var tempPath = e.currentTarget.id;
    const downloadTask = wx.downloadFile({
      url: tempPath, //仅为示例，并非真实的资源
      success: function (res) {
        wx.playVoice({
          filePath: res.tempFilePath
        })
      }
    })
    downloadTask.onProgressUpdate((res) => {
      console.log('下载进度', res.progress)
      console.log('已经下载的数据长度', res.totalBytesWritten)
      console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
    })
  },
  // 进入某个文件夹
  cdFolder: function(e){
    wx.showToast({
      title: '加载中',
      icon: "loading",
      duration: 10000
    })
    var _this = this;
    console.log(e);
    //阻止边界出现
    this.setData({
      baseline: false
    });
    // 如果是root节点就清空id数组和name数组
    if (this.data.folderId == "root"){
      this.data.idList = [];
      this.data.nameList = [];
    }
    // 将id存到数组中
    this.data.idList.push(e.currentTarget.id);
    // 将name存到数组中
    this.data.nameList.push(e.currentTarget.dataset.name);
    // 记录index
    this.data.beforeIndex += 1;
    this.setData({
      folderName: e.currentTarget.dataset.name,
      pageSize:20,
      folderId: e.currentTarget.id,
      showBackArrow: true
    })
    var tempSize = this.data.pageSize;
    var tempId = this.data.folderId;
    // 加载数据
    this.readyToLoad(tempSize,tempId);
    // 页面定位
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
  },
  // 返回上一级
  backToParent: function(e){
    wx.showToast({
      title: '加载中',
      icon: "loading",
      duration: 10000
    })
    console.log(e);
    console.log(this.data.idList);
    // 记录index
    this.data.beforeIndex--;
    console.log(this.data.beforeIndex);
    var tempSize = this.data.pageSize;
    // 根据index寻找id便于请求数据
    var tempId = this.data.idList[this.data.beforeIndex-1];
    // 分局index加载文件夹名称
    var tempName = this.data.nameList[this.data.beforeIndex - 1];
    // 如果回到父节点
    if (this.data.beforeIndex <= 0){
      tempId = "root";
      tempName = "";
      this.setData({
        showBackArrow: false,
        beforeIndex:0,
        // 一定要有这一步，不然滑动到底部触发scroll事件的时候就会出错
        folderId: "root"
      })
    }
    console.log(tempId);
    console.log(tempName);
    // 重新加载显示的文件夹名称
    this.setData({
      folderName: tempName
    })
    // 加载数据列表
    this.readyToLoad(tempSize, tempId);
  },
  // 弹出新建文件夹弹窗
  _creat: function(){
    this.setData({
      newFolderState: !this.data.newFolderState
    })
  },
  // 是否公开
  isChecked: function(e){
    console.log(e.detail.value);
    var tempValue = e.detail.value.length;
    if (tempValue == 1){
      this.setData({
        privacySet: 1
      })
    }else{
      this.setData({
        privacySet: 0
      })
    }
  },
  // 确定创建
  confirmNewFolder: function(){
    var _this = this;
    var tempName = this.data.fileName;
    if (tempName == ""){
      _this.setData({
        mentionFileName: "文件夹名称不能为空！"
      })
    }else{
      _this.newFolderRequest();
      _this.setData({
        newFolderState: true
      });
      _this.readyToLoad(_this.data.pageSize, _this.data.folderId);
    }
  },
  // 取消创建
  cancleNewFolder: function(){
    this.setData({
      newFolderState: true
    })
  },
  // 获取文件夹名称
  getFileName: function(e){
    console.log(e.detail.value);
    this.setData({
      fileName: e.detail.value
    })
  },
  // 发请求新建文件夹
  newFolderRequest: function(){
    var _this = this;
    var map = {};
    //父级目录id   如果没有父级目录，而是在一级列表创建，则空为root
    map['parentId'] = _this.data.folderId;
    //是否是文件夹    1:新建文件夹  2：上传的文件
    map['folder'] = 1;
    //文件夹名称  如果用户未输入 ，可以给一个默认的名称，如果上传的是文件，则这里是文件名称
    map['fileName'] = _this.data.fileName;
    //文件夹/文件权限（公开/隐藏）
    map['privacySet'] = _this.data.privacySet;
    //文件类型（如果是文件夹，则空着）
    map['fileType'] = "";
    //文件分类   (之前商量的方案 不要分类)
    map['fileSort'] = "";
    //文件描述    如果是创建文件夹，则不填
    map['fileDes'] = "";
    //文件大小 单位（kb）  如果是创建文件夹，则不填
    // map['fileSize'] = 0;
    //从文件服务器获取的 文件路径 格式如下。 如果是创建文件夹，则不填
    map['filePath'] = "";
    //是否需要输入密码访问   1需要 0不需要 
    // map['needPassword'] = 0;
    //需要访问的密码 
    // map['filePassword'] = "123456";
    //是否免费下载   1是 0否
    // map['free'] = 0;
    //支付方式  1微信 2支付宝 3积分  先不做   以下字段都支持设置，具体页面再商量
    // map['payWay'] = 3;
    //支付链接   先不做
    // map['payLink'] = "";
    //下载需要花费的积分  二选一  
    // map['needScore'] = 1;
    //下载需要花费的金额  二选一    
    // map['needMoney'] = 0.5;	
    var mapString = JSON.stringify(map).slice(1);
    var value = mapString.substr(0, mapString.length - 1);
    wx.request({
      url: resourceUrl + 'wx_resource/saveResource?value=' + value,
      success: function (res) {
        console.log(res);
      }
    })
  },
  _upload: function(){
    wx.chooseImage({
      success: function(res){
        console.log(res)
      }
    })
  },
  // 编辑文件
  editFolder: function(e){
    // 清空
    this.data.selectedArray = [];
    console.log(e);
    // 动画隐藏tab
    wx.hideTabBar({
      animation:true
    });
    //阻止tap事件
    for (var i = 0; i < this.data.folderList.length;i++){
      this.data.folderList[i].catchTapFn = "";
    }
    this.setData({
      tabBar:"ulBoxShow",
      iconSelect:"iconShow",
      topBar:"topBarShow"
    })
    // 因为加载列表图片时设置的文件夹和非文件夹的id不一样，所以这里需要切换一下
    var curIndex = e.currentTarget.dataset.index;
    var tempId = this.data.folderList[curIndex].id;
    this.isSelected(e, tempId);
    // this.renameRequest();
  },
  // 取消编辑
  _cancleEdit: function(){
    // 清空
    this.data.selectedArray = [];
    this.readyToLoad(this.data.pageSize, this.data.folderId);
    // 显示taBar
    wx.showTabBar({
      animation: true
    });
    this.setData({
      tabBar: "ulBox",
      iconSelect: "iconHide",
      topBar: "topBar"
    })
  },
  // 点击icon
  _selectedIcon: function (e) {
    // ID
    var tempId = e.currentTarget.id;
    console.log(tempId);
    this.isSelected(e, tempId);
  },
  // 全选
  _chooseAll: function () {
    // 清空
    this.data.selectedArray = [];
    var tempList = this.data.folderList
    if (this.data.chooseAll == "全选"){
      this.setData({
        deleteImgUrl: "../../../../icon/deleteFolder.png",
        moveImgUrl: "../../../../icon/move.png",
        renameImgUrl: "../../../../icon/rename.png"
      })
      this.setData({
        chooseAll: "全不选"
      })
      for (var i = 0; i < tempList.length; i++) {
        tempList[i]["iconColor"] = "#409eff";
        tempList[i]["selecteState"] = true;
        this.data.selectedArray.push(this.data.folderList[i]["id"]);
      }
    }else{
      this.setData({
        renameImgUrl: "../../../../icon/rename.png",
        deleteImgUrl: "../../../../icon/deleteBlogClass.png",
        moveImgUrl: "../../../../icon/move-hide.png"
      })
      this.setData({
        chooseAll: "全选"
      })
      for (var i = 0; i < tempList.length; i++) {
        tempList[i]["iconColor"] = "#ccc";
        tempList[i]["selecteState"] = false;
      }
      this.data.selectedArray = [];
    }
    this.setData({
      folderList: tempList,
      chooseAmount: this.data.selectedArray.length
    });
    this._taBarState();
    console.log(this.data.selectedArray);
  },
  isSelected: function (event, tempId) {
    // 状态变量
    var _this = this;
    console.log(event);
    // 下标
    var tempIndex = event.currentTarget.dataset.index;
    // ID state
    var tempState = event.currentTarget.dataset.state;
    // 删除下标
    var deleteIndex = 0;
    // 获取文件列表
    var tempList = this.data.folderList;
    if (!tempState) {
      // 更改列表中的属性
      // 改变icon颜色
      tempList[tempIndex]["iconColor"] = "#409eff";
      // 改变状态变量
      tempList[tempIndex]["selecteState"] = true;
      // 存放id
      this.data.selectedArray.push(tempId);
    } else {
      // 改变icon颜色
      tempList[tempIndex]["iconColor"] = "#ccc";
      // 改变状态变量
      tempList[tempIndex]["selecteState"] = false;
      // 删除id
      // 封装方法
      Array.prototype.indexOf = function (val) {
        for (var i = 0; i < this.length; i++) {
          if (this[i] == val) return i;
        }
        return -1;
      };
      Array.prototype.remove = function (val) {
        var index = this.indexOf(val);
        if (index > -1) {
          this.splice(index, 1);
        }
      };
      this.data.selectedArray.remove(tempId);
    }
    console.log(this.data.selectedArray);
    this.setData({
      folderList: tempList, 
      chooseAmount: this.data.selectedArray.length
    });
    this._taBarState();
  },
  // 判断tabar的状态
  _taBarState: function(){
    if (this.data.selectedArray.length == 0) {
      this.setData({
        renameImgUrl: "../../../../icon/rename.png",
        deleteImgUrl: "../../../../icon/deleteBlogClass.png",
        moveImgUrl: "../../../../icon/move-hide.png"
      })
    } else if (this.data.selectedArray.length > 1) {
      this.setData({
        renameImgUrl: "../../../../icon/rename.png"
      })
    } else {
      this.setData({
        renameImgUrl: "../../../../icon/renameFolder.png",
        deleteImgUrl: "../../../../icon/deleteFolder.png",
        moveImgUrl: "../../../../icon/move.png"
      })
    }
  },
  // 重命名
  _renameFolder: function(){
    if(this.data.selectedArray.length == 1){
      var tempId = this.data.selectedArray[0];
      // 根据id获取文件名称
      for(var i=0;i<this.data.folderList.length;i++){
        if (tempId == this.data.folderList[i].id){
          console.log(this.data.folderList[i].fileName);
          this.setData({
            oldFileName: this.data.folderList[i].fileName,
            oldFileId: tempId,
            oldFileType: this.data.folderList[i].fileType
          })
        }
      }
      // 显示弹窗
      this.setData({
        renameFolderState: false
      })
    }
  },
  // 确认重命名
  confirmRenameFolder: function(e){
    var _this = this;
    console.log(e);
    // 如果未改动则不发请求
    if (this.data.newFolderName == this.data.oldFileName){
      this.setData({
        renameFolderState: false
      })
    } else if (this.data.newFolderName == ""){
      // 若改动了但是为空则不发请求
      this.setData({
        renameFolderState: false,
        mention:"名称不能为空！"
      })
    }else{
      // 不为空且不重复则发请求
      console.log(this.data.oldFileId);
      console.log(this.data.newFolderName);
      // console.log(this.data.oldFileType);
      // var fileType = JSON.parse(_this.data.oldFileType);
      var fileState = "";
      // if (fileType.isFolder == 0){
      //   fileState = "zip";
        // 其实可以正则匹配，但是我不知道这个数据传到后台有什么用
      // }
      this.renameRequest(this.data.oldFileId, this.data.newFolderName, fileState);
    }
  },
  // 取消重命名
  cancleRenameFolder: function(e){
    console.log(e);
    this.setData({
      renameFolderState: true
    })
  },
  // 获取value值
  getNewName: function(e){
    console.log(e.detail.value);
    this.setData({
      newFolderName: e.detail.value
    })
  },
  // 发请求重命名文件或文件夹
  renameRequest: function (id, newName, fileType){
    var _this = this;
    var map = {};
    //文件id 必填
    map['id'] = id;
    //目录id   如果修改,则是将文件移动到该文件夹里
    // map['parentId'] = "abcdefg";
    //修改文件夹名称或文件名称
    map['fileName'] = newName;
    //文件类型  如果是文件夹，则空着
    map['fileType'] = fileType;
    var mapString = JSON.stringify(map).slice(1);
    var value = mapString.substr(0, mapString.length - 1);
    wx.request({
      url: resourceUrl + 'wx_resource/updateResourceInfo?value=' + value,
      success: function (res) {
        console.log(res);
        if(res.data.code == 1){
          wx.showToast({
            title: '修改成功！',
            icon:"success"
          })
          // 隐藏弹出层
          _this.setData({
            renameFolderState: true
          })
          // 加载数据
          _this.readyToLoad(_this.data.pageSize, _this.data.folderId);
          // 显示taBar
          wx.showTabBar({
            animation: true
          });
          _this.setData({
            tabBar: "ulBox",
            iconSelect: "iconHide",
            topBar: "topBar"
          })
        }else{
          // 隐藏弹出层
          _this.setData({
            renameFolderState: true
          })
          wx.showToast({
            title: '失败了o(╥﹏╥)o',
            icon: "loading"
          })
        }
      }
    })
  },
  // 删除文件
  _deleteFolder: function () {
    var _this = this;
    var tempArray = this.data.selectedArray;
    if(tempArray.length!=0){
      _this.setData({
        deleteFolder: "_deleteFolder"
      })
      wx.showModal({
        title: '删除文件',
        content: '确认删除选中的所有文件及文件夹',
        success: function (res) {
          console.log(res);
          var tempId = tempArray.join(",");
          console.log(tempId);
          if (res.confirm) {
            wx.request({
              url: resourceUrl + "wx_resource/deleteResource?value=" + tempId,
              success: function (res) {
                console.log(res);
                if (res.data.code == 1) {
                  wx.showToast({
                    title: '删除成功！',
                    icon: "success"
                  })
                  setTimeout(function () {
                    _this.readyToLoad(_this.data.pageSize, _this.data.folderId);
                    // 显示taBar
                    wx.showTabBar({
                      animation: true
                    });
                    _this.setData({
                      tabBar: "ulBox",
                      iconSelect: "iconHide",
                      topBar: "topBar"
                    })
                  }, 1500);
                } else {
                  wx.showToast({
                    title: '出错了',
                    icon: "loading"
                  })
                  setTimeout(function () {
                    _this.readyToLoad(_this.data.pageSize, _this.data.folderId);
                    // 显示taBar
                    wx.showTabBar({
                      animation: true
                    });
                    _this.setData({
                      tabBar: "ulBox",
                      iconSelect: "iconHide",
                      topBar: "topBar"
                    })
                  }, 1500);
                }
              }
            })
          }
        }
      })
    }else{
      _this.setData({
        deleteFolder: ""
      })
    }
  },
  // 移动文件
  _moveFolder: function(e){
    console.log(e);
    console.log(this.data.selectedArray);
    // 显示文件列表
    this.setData({
      tabBar: "ulBox",
      iconSelect: "iconHide",
      topBar: "topBar",
      moveTo: "moveToShow"
    })
    this.readyToLoad(this.data.pageSize, this.data.folderId);
  },
  // 取消移动
  _cancleMove: function () {
    // 显示taBar
    wx.showTabBar({
      animation: true
    });
    this.setData({
      moveTo: "moveToHide",
      folderId: "root",
      showBackArrow: false,
      beforeIndex: 0
        // 一定要有这一步，不然滑动到底部触发scroll事件的时候就会出错
    })
    this.readyToLoad(this.data.pageSize, this.data.folderId);
  },
  // 确认移动
  _comfirmMove: function(){
    console.log(this.data.folderId);
    console.log(this.data.selectedArray);
    var ids = this.data.selectedArray.join(",");
    console.log(ids);
    this.moveRequest(this.data.folderId, ids)
  },
  // 发请求批量移动
  moveRequest: function(parentId, ids){
    var _this = this;
    var map={};
    //要移动到的地方
    map["parentId"] = parentId;
    //要移动的文件，多个用逗号隔开
    map["ids"] = ids;
    var mapString = JSON.stringify(map).slice(1);
    var value = mapString.substr(0, mapString.length - 1);
    wx.request({
      url: resourceUrl + 'wx_resource/moveFile?value=' +value,
      success: function(res){
        console.log(res);
        if(res.data.code == 1){
          _this.setData({
            moveTo: "moveToHide"
          })
          wx.showToast({
            title: '操作成功！',
            icon:"success"
          })
          _this.readyToLoad(_this.data.pageSize, _this.data.folderId);
        }else{
          wx.showToast({
            title: '失败了o(╥﹏╥)o',
            icon:"loading"
          })
        }
      }
    })
  },
  // 判断边界值开始加载下一页
  startLoading: function (e) {
    console.log(e)
    console.log(this.data.folderId);
    var _this = this;
    var num = this.data.pageSize += 20;
    var upperLimit = this.data.total + 20;
    if (num < upperLimit) {
      wx.showToast({
        title: '加载中',
        icon:"loading",
        duration:10000
      })
      this.readyToLoad(_this.data.pageSize, _this.data.folderId);
    } else {
      _this.setData({
        baseline: true
      })
    }
  }
})