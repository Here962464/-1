var app = getApp();
var blogUrl = app.globalData.globalBlogUrl;
Page({
  data: {
    blogList: [],
    pageSize: 10,
    total: 0,
    scrollY: 0,
    blogTypeName: "",
    classify: "",
    hasBlog: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var tempName = app.globalData.blogTypeName;
    var tempClass = app.globalData.classify;
    console.log(tempName)
    console.log(tempClass)
    this.setData({
      blogTypeName: tempName,
      classify: tempClass
    });
    var _this = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    });
    console.log(this.data.total)
    this.readyToLoad(_this.data.pageSize);
  },
  startLoading: function (e) {
    var _this = this;
    // 懒加载
    var num = this.data.pageSize += 10;
    var upperLimit = this.data.total + 10;
    if (num < upperLimit) {
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 10000
      });
      console.log(111)
      this.readyToLoad(_this.data.pageSize);
    } else {
      _this.setData({
        baseline: true
      })
    }
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
    map['pageNum'] = 1;
    //每页显示的数据条数
    map['pageSize'] = pageSize;
    //查询已经删除的博客（回收站）时  remove=1， 不加默认都查询
    map['remove'] = 0;
    //博文分类 不加时默认都查询
    map['classify'] = this.data.classify;
    //博文类型 不加时默认都查询
    map['blogType'] = this.data.blogTypeName;
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
      url: blogUrl + 'wx_blog/blogList?value=' + value,
      success: function (res) {
        wx.hideToast();
        console.log(res);
        var tempArry = res.data.value.list;
        var tempTotal = res.data.value.total;
        _this.setData({
          blogList: tempArry,
          total: tempTotal
        });
        if (_this.data.total == 0) {
          _this.setData({
            hasBlog: false
          })
        }
      }
    })
  }
})