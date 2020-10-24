// pages/form/index.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxappId: '',
    token: '',
    toFormUrl: '',
    title: '168太空素食',
    personName: ''
  },
  onLoad: function(options){
    console.log(options);
    this.setData({
      personName: options.name || '',
      referee_id: options.referee_id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {

    this.data.token = wx.getStorageSync('token');
    this.getFormUrl();
  },
  
  getFormUrl(){
    let _this = this;
    App._get('page/webView', {
    }, function(result) {
      console.log(result);
      let questionnaire_no = result.data.new_questionnaire.questionnaire_no
      var timestamp = Date.parse(new Date());
      // 设置页面标题
      wx.setNavigationBarTitle({
        title: result.data.new_questionnaire.title
      });
      _this.setData({
        // title: result.data.new_questionnaire.title,
        toFormUrl: result.data.new_questionnaire.url+'#/?token='+_this.data.token+'&questionnaire_no='+questionnaire_no+'&time='+timestamp+'&name='+encodeURIComponent(_this.data.personName)+'&referee_id='+_this.data.referee_id
      })
      console.log(_this.data.toFormUrl);
    });
  },
 /**
   * 分享当前页面
   */
  onShareAppMessage() {
    let _this = this;
    return {
      title: _this.data.title,
      path: "/pages/home/index?" + App.getShareUrlParams()
    };
  }
  
})