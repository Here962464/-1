const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    show:false
  },
  onShow: function () {
    this.onLoad();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权
          // 率先加载用户界面
          wx.switchTab({
            url: '../home/home'
          })
          //调用 getUserInfo 获取头像昵称
          // wx.getUserInfo({
          //   success: function(res){
          //     console.log(res)
          //     _this.loadUserInfo(res)
          //   }
          // })
        }else{
         console.log("用户未授权");
        }
      }
    })
  },
  // 唤起请求获取用户信息弹窗
  getUserInfo: function (e) {
    console.log(e)
    wx.getUserInfo({
      success: function(e){
        console.log(e)
      },
      fail: function(e){

      }
    })
    var _this = this;
    // this.loadUserInfo(e.detail);
    wx.switchTab({
      url: '../home/home'
    })
  }
})