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
      gender:0
    },
    show:true,
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
  wxLogIn:function(){
    var _this = this;
    //登录
    wx.login({
      success: function(){
        // 从本地缓存获取数据
        wx.getUserInfo({
          success: function (res) {
            // 转换性别
            var gender = res.userInfo.gender;
            if (!gender) {
              gender = "未知";
            } else if (gender == 1) {
              gender = "男";
            } else {
              gender = '女';
            }
            var userNickname = res.userInfo.nickName;
            var iconPath = res.userInfo.avatarUrl;
            console.log(res)
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
      }
    })
  },
  loginByMail: function(){
    var _this = this;
    wx.navigateTo({
      url:"../details/loginByMail/loginByMail"
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.wxLogIn()
    // wx.getUserInfo({
    //   success: function(res){
    //     console.log(res)
    //     if (res.errMsg == "getUserInfo:ok"){
          
    //     }
    //   }
    // })
  },
  getUserInfo: function (e) {
    
  }
})