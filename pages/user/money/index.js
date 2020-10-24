const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 获取分销商中心数据
    this.getAgentWallet();
  },

  /**
   * 获取分销商中心数据
   */
  getAgentWallet: function() {
    let _this = this;
    App._get('user.dealer.withdraw/index', {}, function(result) {
      let data = result.data;
      console.log(result)

      // 设置当前页面标题
      wx.setNavigationBarTitle({
        title: "我的钱包"
      });
      _this.setData(data);
    });
  },

  /**
   * 跳转到提现页面
   */
  navigationToWithdraw: function() {
    wx.navigateTo({
      url: '/pages/dealer/withdraw/apply/apply',
    })
  },

  /**
   * 立即加入分销商
   */
  triggerApply: function(e) {
    // 记录formId
    App.saveFormId(e.detail.formId);
    wx.navigateTo({
      url: '../apply/apply',
    })
  },

})