const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.getMessageIndex();
  },
  /**
   * 获取消息主页类型
   */
  getMessageIndex(){
    let _this = this;
    App._get('user.message/index', {}, result => {
      console.log(result.data.list);
      _this.setData({list:result.data.list});
    });
  },
  // 跳转消息列表
  toMessageList(e){
    let type = e.currentTarget.dataset.type,
    name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: './list?type='+type+'&name='+name
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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

  }
})