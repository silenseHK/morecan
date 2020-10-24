const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxappId: '',
    token: '',
    toFormUrl: '',
    title: '',
    shareUrlPath: ''
  },
  onLoad:function(options){
   if(JSON.stringify(options) === '{}'){
      this.getFormUrl();
    }else{
      this.setData({
        toFormUrl: decodeURIComponent(options.shareUrlPath)
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.data.token = wx.getStorageSync('token');
  },
  
  getFormUrl(){
    let _this = this;
    App._get('college.lesson/collegeEntrance', {
    }, function(result) {
        // 设置页面标题
    wx.setNavigationBarTitle({
      title: result.data.title
    });
      _this.setData({
        title: result.data.title,
        toFormUrl: result.data.url+'#/?token='+_this.data.token+'&time=123456789'
      })
      console.log(_this.data.toFormUrl)
    });
  },
 /**
   * 分享当前页面
   */
  onShareAppMessage(options) {
    let _this = this;
    return {
      title: _this.data.title,
      path: "/pages/lesson/index?" + App.getShareUrlParams()+'&shareUrlPath='+encodeURIComponent(options.webViewUrl)
    };
  }
  
})