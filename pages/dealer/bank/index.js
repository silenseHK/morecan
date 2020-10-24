let App = getApp();

Page({
  data: {
    list: [],
    default_id: null,
  },

  onLoad: function(options) {
    // 当前页面参数
    this.data.options = options;
  },

  onShow: function() {
    // 获取银行卡列表
    this.getBankList();
  },

  /**
   * 获取银行卡列表
   */
  getBankList: function() {
    let _this = this;
    App._get('user.bank_card/lists', {}, function(result) {
      _this.setData(result.data);
    });
  },

  /**
   * 添加新银行卡
   */
  createBank: function() {
    wx.navigateTo({
      url: './create'
    });
  },

  /**
   * 编辑地址
   */
  editBank: function(e) {
    wx.navigateTo({
      url: "./edit?card_id=" + e.currentTarget.dataset.id
    });
  },

  /**
   * 移除银行卡
   */
  removeBank: function(e) {
    let _this = this,
    card_id = e.currentTarget.dataset.id;
    wx.showModal({
      title: "提示",
      content: "您确定要移除当前银行卡吗?",
      success: function(o) {
        o.confirm && App._post_form('user.bank_card/del', {
          card_id
        }, function(result) {
          _this.getBankList();
        });
      }
    });
  },

  /**
   * 设置为默认银行卡
   */
  setDefault: function(e) {
    let _this = this,
      card_id = e.detail.value;
    _this.setData({
      default_id: parseInt(card_id)
    });
    App._post_form('user.bank_card/setDefault', {
      card_id
    }, function(result) {
      let pages = getCurrentPages(); //获取当前页面pages里的所有信息。
      let prevPage = pages[pages.length - 2]; //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
      prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
        choose_id: card_id
      })
      _this.data.options.from === 'apply' && wx.navigateBack({ delta: 1});
    });
    return false;
  },

});