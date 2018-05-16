// var app = getApp();
// var blogUrl = app.globalData.globalBlogUrl;
// var total = 0;
// var map = {};
// //当前页号
// map['pageNum'] = 1;
// //每页显示的数据条数
// map['pageSize'] = 1;
// //查询已经删除的博客（回收站）时  remove=1， 不加默认都查询
// map['remove'] = 0;
// map['arrange'] = "DESC";
// var mapString = JSON.stringify(map).slice(1);
// var value = mapString.substr(0, mapString.length - 1);
// wx.request({
//   url: blogUrl + 'wx_blog/blogList?value=' + value,
//   success: function (res) {
//     total = res.data.value.total;
   
//   },
//   fail: function (res) {
//     console.log(res);
//   }
// })
var haha = [
  {
    name: "博客",
    star: 200
  },
  {
    name: "关注",
    star: 200
  },
  {
    name: "粉丝",
    star: 300
  }
];
module.exports = {
  haha: haha
}


