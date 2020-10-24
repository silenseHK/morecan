const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    clientHeight: '',
    errorMessage: '',
    personName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let systemInfo = wx.getSystemInfoSync(),
    scrollHeight = systemInfo.windowHeight;

    this.setData({
      clientHeight: scrollHeight,
      personName: options.name?options.name: ''
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },


  formSubmit(e) {
    let errorMessage = '';
    if(e.detail.value.name == ''){
      errorMessage = "请填写姓名"
    }
    if(errorMessage){
      this.setData({errorMessage: errorMessage})
      return false;
    }else{
      this.setData({errorMessage: ''})
    }
    this.setData({
      personName: e.detail.value.name
    })
    wx.navigateTo({
      url: './way?name='+this.data.personName,
    })

  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let _this = this;
    return {
      title: _this.data.title,
      path: "/pages/home/index?" + App.getShareUrlParams()
    };
  }
})