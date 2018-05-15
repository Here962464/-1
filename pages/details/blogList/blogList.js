var app = getApp();
var blogUrl = app.globalData.globalBlogUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 博客列表
    blogList: [],
    // 列表开关
    thisIndex: 0,
    isblog:true,
    // 分类列表
    blogtypeList:[],
    // 懒加载
    pageSize:10,
    total:0,
    scrollY:'',
    // 底线
    baseline: false,
    // 导航样式
    articleBgColor:"#409eff",
    articleFontColor:"#fff",
    groupBgColor: "#F1F1F1",
    groupFontColor: "#000",
    article:true,
    group:false,
    // 关门狗 避免切换选项卡时重复发请求
    dog:true,
    // 新建一级分类
    hideClassify: true,
    classifyName:"" ,
    classNameCheck: "请输入文集名称",
    // 新建二级分类
    hiddType: true,
    typeName: "",
    typeNameCheck:"请输入分类名称",
    // 重命名一级分类
    renameClass: true,
    newClassifyName: "",
    newClassNameCheck: "请输入文集名称",
    oldClassName:"",
    // 重命名二级分类
    renameType: true,
    newTypeName: "",
    newTypeNameCheck: "请输入分类名称",
    oldTypeName:"",
    blogTypeId: "",
    fatherName:""
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
    this.readyToLoad(_this.data.pageSize);
  },
  // 点击菜单栏博客
  switchBlog: function(){
    // 切换菜单样式
    this.setData({
      isblog: true,
      group:false,
      article:true
    })
    if (this.data.article){
      this.setData({
        articleBgColor: "#409eff",
        articleFontColor: "#fff",
        groupBgColor: "#F1F1F1",
        groupFontColor: "#000"
      })
    }
  },
  // 点击菜单栏文集
  switchCorpus: function(){
    var _this = this;
    // 切换菜单样式
    this.setData({
      isblog: false,
      group: true,
      article: false
    })
    if (this.data.group) {
      this.setData({
        articleBgColor: "#F1F1F1",
        articleFontColor: "#000",
        groupBgColor: "#409eff",
        groupFontColor: "#fff"
      })
    }
    // 加载完毕关门,阻止重新加载
    if(this.data.dog){
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 10000
      });
      this.loadcroups();
      this.setData({
        dog:false
      })
    }
  },
  // 点击文集列表
  isSons: function (e) {
    console.log(e.currentTarget.dataset.index);
    var tempIndex = e.currentTarget.dataset.index;
    this.setData({
      thisIndex: tempIndex
    })
    var b = this.data.blogtypeList[tempIndex].toggle;
    this.data.blogtypeList[tempIndex].toggle = !b;
    //设置之后我们要把数据从新添回去 
    this.setData({
      blogtypeList: this.data.blogtypeList
    })
  },
  //新建一级分类
  //点击按钮弹出指定的hideClassify弹出框
  creatNewClass: function () {
    this.setData({
      hideClassify: !this.data.hideClassify
    })
  },
  //取消按钮  
  cancleCreatClass: function () {
    this.setData({
      hideClassify: true
    });
  },
  //确认  
  confirmCreatClass: function (e) {
    var _this = this;
    console.log(this.data.classifyName);
    if (this.data.classifyName!=""){
      _this.setData({
        hideClassify: true
      });
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 10000
      });
      _this.getClassify();
    }else{
      _this.setData({
        hideClassify: false,
        classNameCheck:"文集名称不能为空！"
      });
    }
  }, 
  // 获取input的内容
  getClassName: function(e){
    console.log(e.detail.value);
    this.setData({
      classifyName: e.detail.value
    })
  },
  // 发请求创建一级分类
  getClassify: function () {
    var _this = this;
    var map = {};
    //博客分类  必填
    map['classify'] = this.data.classifyName;
    //博客类型 非必填
    map['blogType'] = "未命名分类";
    var mapString = JSON.stringify(map).slice(1);
    var value = mapString.substr(0, mapString.length - 1);
    wx.request({
      url: blogUrl + 'wx_blogtype/addBlogType?value=' + value,
      success: function (res) {
        if (res.data.code == 1) {
          console.log(res);
          _this.loadcroups();
          wx.hideToast();
          wx.showToast({
            title: '创建成功！',
            icon: "success"
          })
        } else if (res.data.code == 2) {
          wx.hideToast();
          wx.showToast({
            title: '已存在该分类',
            icon: "none",
            duration: 2000
          })
        }
      }
    })
  },
  // 重命名一级分类
  renameBlogClass: function (e) {
    console.log(e.currentTarget.dataset.index);
    var tempIndex = e.currentTarget.dataset.index;
    var tempName = this.data.blogtypeList[tempIndex].key;
    this.setData({
      renameClass: !this.data.renameClass,
      oldClassName: tempName
    })
  },
  //取消按钮  
  cancleRenameClass: function () {
    this.setData({
      renameClass: true
    });
  },
  //确认  
  confirmRenameClass: function (e) {
    var _this = this;
    var oldName = this.data.oldClassName;
    var newName = this.data.newClassifyName;
    if (newName == "") {
      _this.setData({
        renameClass: false,
        newClassNameCheck: "文集名称不能为空！"
      });
    } else if (newName != "" && newName != oldName){
      _this.setData({
        renameClass: true
      });
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 10000
      });
      this.renameClassFn(oldName,newName);
    } else if (newName == oldName){
      _this.setData({
        renameClass: true
      });
      console.log("xiangdeng")
    }
  },
  // 获取input的内容
  getRenameClass: function (e) {
    console.log(e.detail.value);
    this.setData({
      newClassifyName: e.detail.value
    })
  },
  // 发请求修改一级分类
  renameClassFn: function(oldClass,newClass){
    var _this = this;
    var map = {};
    //要更新哪一个分类名称
    map['classifyOld'] = oldClass;
    //要更新后的一级分类名称
    map['classify'] = newClass;
    var mapString = JSON.stringify(map).slice(1);
    var value = mapString.substr(0, mapString.length - 1);
    wx.request({
      url: blogUrl + "wx_blogtype/updateFirstClassBlogType?value="+value,
      success: function(res){
        wx.hideToast();
        console.log(res);
        if(res.data.code == 1){
          wx.showToast({
            title: '修改成功',
            icon:"success",
            duration:1000
          })
        }else{
          wx.showToast({
            title: '失败了o(╥﹏╥)o',
            icon: "loading",
            duration: 2000
          })
        }
        _this.loadcroups();
      }
    })
  },
  // 删除一级分类
  deleteBlogClass: function (e) {
    var _this = this;
    console.log(e.currentTarget.dataset.index);
    var tempIndex = e.currentTarget.dataset.index;
    var tempName = this.data.blogtypeList[tempIndex].key;
    wx.showModal({
      title: '删除文集',
      content: '确认删除本文集，并清空文集里所有博客',
      confirmText: "删除",
      success: function(res){
        if(res.confirm){
          wx.showToast({
            title: '删除中...',
            icon: "loading",
            duration: 10000
          })
          wx.request({
            url: blogUrl + 'wx_blogtype/deleteBlogClassify?value=' + tempName,
            success: function (res) {
              wx.hideToast();
              console.log(res);
              if (res.data.code == 1) {
                wx.showToast({
                  title: '删除成功！',
                  icon: "success",
                  duration: 2000
                })
                _this.loadcroups();
              }
            }
          })
        }else{
          console.log("用户点击取消")
        }
      }
    })
  },
  // 新建二级分类
  creatNewType: function (e) {
    this.setData({
      hiddType: !this.data.hiddType
    })
  },
  //取消按钮  
  cancelCreatType: function () {
    this.setData({
      hiddType: true
    });
  },
  //确认  
  confirmCreatType: function (e) {
    var _this = this;
    console.log(this.data.typeName);
    if (this.data.typeName != "") {
      _this.setData({
        hiddType: true
      });
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 10000
      });
      _this.getType();
    } else {
      _this.setData({
        hideType: false,
        typeNameCheck: "分类名称不能为空！"
      });
    }
  },
  // 获取input内容
  getTypeName: function (e) {
    console.log(e);
    this.setData({
      typeName: e.detail.value
    })
  },
  // 发请求创建二级分类
  getType: function () {
    var _this = this;
    var map = {};
    //博客分类  必填
    console.log(_this.data.blogtypeList);
    var tempIndex = _this.data.thisIndex;
    map['classify'] = _this.data.blogtypeList[tempIndex].key;
    //博客类型 非必填
    map['blogType'] = _this.data.typeName;
    var mapString = JSON.stringify(map).slice(1);
    var value = mapString.substr(0, mapString.length - 1);
    wx.request({
      url: blogUrl + 'wx_blogtype/addBlogType?value=' + value,
      success: function (res) {
        if (res.data.code == 1) {
          console.log(res);
          _this.loadcroups();
          wx.hideToast();
          wx.showToast({
            title: '创建成功！',
            icon: "success"
          })
        } else if (res.data.code == 2) {
          wx.hideToast();
          wx.showToast({
            title: '已存在该分类',
            icon: "none",
            duration: 2000
          })
        }
      }
    })
  },
  hahaha: function () {
    // console.log("我是用来阻止冒泡的")
  },
  // 重命名二级分类
  editBlogType: function (e) {
    console.log(e.currentTarget.dataset.index);
    console.log(this.data.thisIndex);
    // 一级分类index
    var fatherIndex = this.data.thisIndex;
    // 二级分类index
    var tempIndex = e.currentTarget.dataset.index;
    // 二级分类名称（旧）
    var tempName = this.data.blogtypeList[fatherIndex].value[tempIndex].blogType;
    // 一级分类名称
    var tempfatherName = this.data.blogtypeList[fatherIndex].key;
    // 二级分类id
    var tempId = this.data.blogtypeList[fatherIndex].value[tempIndex].id;
    console.log(tempIndex)
    console.log(tempfatherName)
    console.log(tempName)
    console.log(tempId)
    this.setData({
      renameType: !this.data.renameType,
      oldTypeName: tempName,
      blogTypeId: tempId,
      fatherName: tempfatherName
    })
  },

  //取消按钮  
  cancleRenameType: function () {
    this.setData({
      renameType: true
    });
  },
  //确认  
  confirmRenameType: function (e) {
    var _this = this;
    var oldName = this.data.oldTypeName;
    console.log(oldName)
    var newName = this.data.newTypeName;
    console.log(newName)
    
    if (newName == "") {
      _this.setData({
        renameType: false,
        newTypeNameCheck: "文集名称不能为空！"
      });
    } else if (newName != "" && newName != oldName) {
      _this.setData({
        renameType: true
      });
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 10000
      });
      this.renameTypeFn(newName);
    } else if (newName == oldName) {
      _this.setData({
        renameType: true
      });
    }
  },
  // 获取input的内容
  getRenameType: function (e) {
    console.log(e.detail.value);
    this.setData({
      newTypeName: e.detail.value
    })
  },
  // 发请求修改二级分类
  renameTypeFn: function (newType) {
    var _this = this;
    var map = {};
    //要更新的分类id 必填
    map['id'] = this.data.blogTypeId;
    //要更新的博客分类 必填
    map['classify'] = this.data.fatherName;
    //要更新的博客类型 必填
    map['blogType'] = newType;
    console.log(newType);
    var mapString = JSON.stringify(map).slice(1);
    var value = mapString.substr(0, mapString.length - 1);
    wx.request({
      url: blogUrl + "wx_blogtype/updateBlogType?value=" + value,
      success: function (res) {
        wx.hideToast();
        console.log(res);
        if (res.data.code == 1) {
          wx.showToast({
            title: '修改成功',
            icon: "success",
            duration: 1000
          })
        } else {
          wx.showToast({
            title: '失败了o(╥﹏╥)o',
            icon: "loading",
            duration: 2000
          })
        }
        _this.loadcroups();
      }
    })
  },
  // 删除二级分类
  deleteBlogType: function (e) {
    var _this = this;
    console.log(e.currentTarget.dataset.index);
    var fatherIndex = this.data.thisIndex;
    var tempIndex = e.currentTarget.dataset.index;
    var tempId = this.data.blogtypeList[fatherIndex].value[tempIndex].id;
    wx.showModal({
      title: '删除分类',
      content: '确认删除本分类，并清空分类里所有博客',
      confirmText: "删除",
      success: function (res) {
        if (res.confirm) {
          wx.showToast({
            title: '删除中...',
            icon: "loading",
            duration: 10000
          })
          wx.request({
            url: blogUrl + 'wx_blogtype/deleteBlogType?value=' + tempId,
            success: function (res) {
              wx.hideToast();
              console.log(res);
              if (res.data.code == 1) {
                wx.showToast({
                  title: '删除成功！',
                  icon: "success",
                  duration: 2000
                })
                _this.loadcroups();
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }  
      },
      fail: function(){
        console.log("no")
      }
    })
  },
  // 发请求加载一级分类
  loadcroups: function(){
    var _this = this;
    var map = {};
    //列排序  按照时间降序 DESC  升序 ASC  不加默认按时间降序
    map['arrange'] = "DESC";
    //0为 正常列表 1为回收站列表
    map['isDelete'] = 0;
    var mapString = JSON.stringify(map).slice(1);
    var value = mapString.substr(0, mapString.length - 1);
    wx.request({
      url: blogUrl + 'wx_blogtype/selectBlogType?value=' + value,
      success: function (res) {
        console.log(res)
        var tempArry = res.data.value;
        for (var i = 0; i < tempArry.length; i++) {
          tempArry[i]['toggle'] = false; //添加toggle 属性 
        }
        wx.hideToast();
        _this.setData({
          blogtypeList: tempArry
        })
        console.log(_this.data.blogtypeList)
      }
    })
  },
  // 加载博客列表
  readyToLoad: function (pageSize) {
    var _this = this;
    // 获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight);
        _this.setData({
          scrollY: res.windowHeight
        })
      },
    })
    var map = {};
    //当前页号
    map  ['pageNum'] = 1;
    //每页显示的数据条数
    map['pageSize'] = pageSize;
    //查询已经删除的博客（回收站）时  remove=1， 不加默认都查询
    map['remove'] = 0;
    //博文分类 不加时默认都查询
    // map['classify'] = "软件开发";
    //博文类型 不加时默认都查询
    // map['blogType'] = "JAVA开发";
    //博客性质（原创、转载、翻译）
    // map['nature'] = "原创";
    //草稿箱列表 draft=1    不加时默认都查询
    // map['draft'] = 0;
    //按照权限查询（公开/隐藏）  privacySet=1公开  0 隐藏  不加默认都查询
    // map['privacySet'] = 1;
    //按照是否打赏查询   reward=1打赏  0 不打赏  不加默认都查询
    // map['reward'] = 0;
    //列排序  按照时间降序 DESC  升序 ASC  不加默认按时间降序
    map['arrange'] = "DESC";
    var mapString = JSON.stringify(map).slice(1);
    var value = mapString.substr(0, mapString.length - 1);
    wx.request({
      url: blogUrl +'wx_blog/blogList?value=' + value,
      success: function (res) {
        console.log(res);
        wx.hideToast();
        console.log(res);
        var tempArry = res.data.value.list;
        var tempTotal = res.data.value.total;
        _this.setData({
          blogList: tempArry,
          total: tempTotal
        })
      },
      fail: function(res){
        console.log(res);
      }
    })
  },
  // 判断边界值开始加载下一页
  startLoading: function (e) {
    console.log(e);
    var _this = this;
    var num = this.data.pageSize += 10;
    var upperLimit = this.data.total + 10;
    if (num < upperLimit) {
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 10000
      });
      this.readyToLoad(_this.data.pageSize);
    } else {
      _this.setData({
        baseline: true
      })
    }
  },
  goToBlogListType: function(e){
    console.log(e);
    var fatherIndex = this.data.thisIndex;
    console.log(fatherIndex)
    var tempIndex = e.currentTarget.dataset.index;
    console.log(tempIndex)
    var blogTypeName = this.data.blogtypeList[fatherIndex].value[tempIndex].blogType;
    var classify = this.data.blogtypeList[fatherIndex].value[tempIndex].classify;
    console.log(blogTypeName)
    console.log(classify)
    app.globalData.blogTypeName = blogTypeName;
    app.globalData.classify = classify;
    wx.navigateTo({
      url: 'secondary/secondary'
    })
  }
})