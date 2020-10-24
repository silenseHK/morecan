// pages/form/index.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxappId: '',
    token: '',
    toFormUrl: '',
    title: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.data.token = wx.getStorageSync('token');
    this.getFormUrl();
  },
  
  getFormUrl(){
    let _this = this;
    App._get('page/webView', {
    }, function(result) {
        // 设置页面标题
      _this.setData({
        // title: result.data.title,
        toFormUrl: result.data.experience_rank.url+'?token='+_this.data.token
      })
      console.log(_this.data.toFormUrl);
    });
  },
 /**
   * 分享当前页面
   */
  onShareAppMessage() {
    let _this = this;
    return {
      title: _this.data.title,
      path: "/pages/form/index?" + App.getShareUrlParams()
    };
  }
  
})