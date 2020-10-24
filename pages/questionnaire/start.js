const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    referee_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      referee_id: options.referee_id?options.referee_id:''
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _this = this;
    _this.setData({
      isLogin: App.checkIsLogin()
    });
  },

  onConfirmSubmit(){
    if(this.data.isLogin){
      wx.navigateTo({
        url: './form?referee_id='+this.data.referee_id
      })
    }else{
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
    
  },

  /**
   * 分享当前页面
   */
  onShareAppMessage() {
    let _this = this;
    return {
      title: _this.data.page.params.share_title,
      path: "/pages/questionnaire/start?" + App.getShareUrlParams()
    };
  }
})