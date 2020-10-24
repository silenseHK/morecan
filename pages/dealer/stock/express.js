const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: {},

    express: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取物流动态
    this.getExpressDynamic(options.deliver_id);
  },

  /**
   * 获取物流动态
   */
  getExpressDynamic: function(deliver_id) {
    let _this = this;
    App._get('user.goods/express', {
      deliver_id
      }, function(result) {
        _this.setData(result.data);
      },
      function() {
        // wx.navigateBack();
      });
  },

})