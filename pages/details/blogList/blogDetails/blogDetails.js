var app = getApp();
var blogUrl = app.globalData.globalBlogUrl;
var wxParse = require("wxParse/wxParse.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogTitle:"我是题目",
    nature:"原创",
    updateDate:"一个特别的日子",
    classAA:"一级分类",
    classAa:"二级分类"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    console.log(app.globalData.blogDetailId);
    var tempId = app.globalData.blogDetailId;
    wx.request({
      url: blogUrl +'wx_blog/selectBlogById?value=' + tempId,
      success: function(res){
        console.log(res);
        if(res.data.code == 1){
          var tempArray = res.data.value;
          // 富文本转换
          var tempBlogContent = tempArray.blog;
          wxParse.wxParse("blogContent", "html", tempBlogContent,_this,1)

          _this.setData({
            blogTitle: tempArray.blogTitle,
            nature: tempArray.nature,
            updateDate: tempArray.updateDate,
            classAA: tempArray.classify,
            classAa: tempArray.blogType
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})