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
    groupBgColor: "#eee",
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
    // 重命名二级分类
    renameType: true,
    newTypeName: "",
    newTypeNameCheck: "请输入分类名称",
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
        groupBgColor: "#eee",
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
        articleBgColor: "#eee",
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
        calssNameCheck:"文集名称不能为空！"
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
  renameBlogClass: function () {
    this.setData({
      renameClass: !this.data.renameClass
    })
  },
  //取消按钮  
  cancleRename: function () {
    this.setData({
      renameClass: true
    });
  },
  //确认  
  confirmRename: function (e) {
    var _this = this;
    console.log(this.data.newClassifyName);
    if (this.data.newClassifyName != "") {
      _this.setData({
        renameClass: true
      });
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 10000
      });
    } else {
      _this.setData({
        renameClass: false,
        calssNameCheck: "文集名称不能为空！"
      });
    }
  },
  // 获取input的内容
  getRename: function (e) {
    console.log(e.detail.value);
    this.setData({
      newClassifyName: e.detail.value
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
  // 发请求加载博客列表
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
  // 修改分类名称
  editBlogClass: function(e){
    console.log(e.currentTarget.dataset.index);
  },
  // 删除一级分类
  deleteBlogClass: function(e){
    console.log(e.currentTarget.dataset.index);
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