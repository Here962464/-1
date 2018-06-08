var floor01 = require("../templates/mine-template/floor01/floor01.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    haha: floor01.haha,
    userInfo: {
      nickName:'',
      avatarUrl:'',
      gender:"亦男亦女"
    },
    show:false,
    showListUrl:[
      '../details/blogList/blogList',
      '../details/followList/followList',
      '../details/fansList/fansList'
    ]
  
  },
  showList: function(e){
    console.log(e)
    var tempIndex = e.currentTarget.dataset.index;
    var tempUrl = this.data.showListUrl[tempIndex];
    wx.navigateTo({
      url: tempUrl,
    })
  },
  loginByMail: function(){
    var _this = this;
    wx.navigateTo({
      url:"../details/loginByMail/loginByMail"
    })
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
            url: 'home/home'
          })
          //调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res){
              console.log(res)
              _this.loadUserInfo(res)
            }
          })
        }else{
         console.log("用户未授权");
        }
      }
    })
  },
  // 唤起请求获取用户信息弹窗
  getUserInfo: function (e) {
    console.log(e.detail.userInfo)
    var _this = this;
    this.loadUserInfo(e.detail);
  },
  loadUserInfo: function(data){
    var _this = this;
    // 转换性别
    var gender = data.userInfo.gender;
    if (!gender) {
      gender = "未知";
    } else if (gender == 1) {
      gender = "男";
    } else {
      gender = '女';
    }
    var userNickname = data.userInfo.nickName;
    var iconPath = data.userInfo.avatarUrl;
    console.log(data)
    _this.setData({
      show: true,
      userInfo: {
        userNickname: userNickname,
        avatarUrl: iconPath,
        gender: gender
      }
    });
  }
})