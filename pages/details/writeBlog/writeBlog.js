var WxParse = require('WxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    article: '<div style="text-align:center;">《静夜思》· 李白<br />床前明月光，<br />疑是地上霜。 <br />举头望明月， <br />低头思故乡。<br /></div>'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var temp = WxParse.wxParse('article', 'html', that.data.article, that, 5);
    that.setData({
      article: temp
    })
  }
})
