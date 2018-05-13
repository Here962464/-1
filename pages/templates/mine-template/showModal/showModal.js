//取消按钮  
var cancelFn = function () {
  console.log("this is cancleFn")
  this.setData({
    hideState: true
  });
};
//确认  
var confirmFn = function (e) {
  console.log("this is confirmFn")
  var _this = this;
  console.log(this.data.inputContent);
  if (this.data.inputContent != "") {
    _this.setData({
      hideState: true
    });
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    });
  } else {
    _this.setData({
      hideState: false,
      mention: "分类名称不能为空！"
    });
  }
};
// 获取input内容
var getInputContent = function (e) {
  console.log("this is getInputContent")
  console.log(e);
  this.setData({
    inputContent: e.detail.value
  })
};
// 暴露接口
module.exports = {
  cancelFn: cancelFn,
  confirmFn: confirmFn,
  getInputContent: getInputContent
}