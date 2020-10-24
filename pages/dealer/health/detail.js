// pages/form/index.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxappId: '',
    fill_id: '',
    url: '',
    token: '',
    toFormUrl: '',
  },
  onLoad:function(options){
    console.log(options);
    this.setData({
      fill_id: options.fill_id,
      url: options.url
    })
    this.data.token = wx.getStorageSync('token');
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.getFormUrl();
  },
  
  getFormUrl(){
    let _this = this;

      _this.setData({
        toFormUrl: _this.data.url+'?token='+_this.data.token+'&fill_id='+_this.data.fill_id
      })
      console.log(_this.data.toFormUrl);

  },
 /**
   * 分享当前页面
   */
  onShareAppMessage() {
    let _this = this;
    return {
      title: _this.data.page.params.share_title,
      path: "/pages/dealer/health/detail?" + App.getShareUrlParams()
    };
  }
  
})