const App = getApp();
const wxParse = require("../../wxParse/wxParse.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    question_id: '',
    // 问题详情
    detail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      question_id: options.question_id
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
    let _this = this;
    _this.getQuestionContent();
  },
  /**
   * 获取问题详情
   */
  getQuestionContent(){
    let _this = this;
    App._get('online_questions/answerDetail', {
      question_id: _this.data.question_id
    }, result => {
      let detail = result.data.info;
      if (detail.answer.length > 0) {
        wxParse.wxParse('content', 'html', detail.answer, _this, 0);
      }
      _this.setData({detail})
    })
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})