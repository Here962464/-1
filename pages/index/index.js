Page({
  data:{
    
  },
  onLoad: function(options){
    var blogId = "2222222";
    wx.request({
      url: 'https://www.sharismspace.com/blog_server-0.0.1-SNAPSHOT/wx_bloglike/getBlogLikeCountByBlogId?value=' + blogId,
      success: function(res){
        console.log(res);
      }
    })
  }
})
