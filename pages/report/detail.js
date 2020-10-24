const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: true,
    fill_id: '',
    bmi: '',
    fill_id: '',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({fill_id: options.fill_id})
    this.getReportDetail()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  
  getReportDetail(){
    let _this = this;
    wx.showLoading({
      title: '加载中..',
    })
    App._get('questionnaire/healthAdvice', {
      fill_id: _this.data.fill_id
    }, function(result) {
      wx.hideLoading({
        complete: (res) => {},
      })
      let resList = result.data.info.advice,
      bmi = parseFloat(result.data.info.bmi).toFixed(2);
      _this.setData({
        bmi: bmi,
        list: resList,
        isLoading: false
      })

    })
  },
  /**
   * 去购买
   */
  onConfirmSubmit(){
    wx.navigateTo({
      url: '/pages/plan/plan',
    })
  },
 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})