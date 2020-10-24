const App = getApp();

Component({
  

  options: {
    addGlobalClass: true,
  },
  
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isMessage: ''
  },

  created: function(){
    let _this = this;
    App._get('user.index/detail', {}, function(result) {
      _this.setData({isMessage:result.data.message>0?true:false});
    });
  },
  /**
   * 组件的方法列表
   */
  methods: {
    toMessageIndex(){
      let _this = this;
      let tmplItem = 'BKUWE9eb2uAd2AFt9iuffitK1kMmp8CWKikIlHpsw5I';
      if (tmplItem.length > 0) {
        wx.requestSubscribeMessage({
          tmplIds: [tmplItem],
          success(res) {

          },
          fail(res) {
     
          },
          complete(res) {
            _this.toMessageList();
          },
        });
      }
    },

    /**
     * 跳转消息列表
     */
    toMessageList(){
      wx.navigateTo({
        url: '/pages/message/index',
      })
    }
  }
})
