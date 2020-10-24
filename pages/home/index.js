const App = getApp();

Page({

  data: {
    // 页面参数
    options: {},
    isLogin: false,
    // 页面元素
    items: {},
    scrollTop: 0,
        // 分享按钮组件
        share: {
          show: false,
          cancelWithMask: true,
          cancelText: '关闭',
          actions: [{
            name: '生成商品海报',
            className: 'action-class',
            loading: false
          }, {
            name: '发送给朋友',
            openType: 'share'
          }],
          // 商品海报
          showPopup: false,
        },
        isIPX: App.globalData.isIPX,  // 将全局参数值赋予当前页面
        resItem:[],
        showFixedNav: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 当前页面参数
    this.setData({
      options
    });
    this.getIndexPage();

    // 加载页面数据
    // if(this.data.resItem){
    //   this.getPageData();
    // }
  },

  onShow(){
    this.setData({
      isLogin: App.checkIsLogin()
    });
  },

  /**
   * 加载页面数据
   */
  getPageData: function(callback) {
    let _this = this;
    App._get('page/index', {
      // page_id: _this.data.options.page_id || 0
      page_id: '10005'
    }, function(result) {
      // 设置顶部导航栏栏
      _this.setPageBar(result.data.page);
      let dataItemList = result.data.items;
      // 获取到的定制数据
      let resIndexData = _this.data.resItem;
  
      for(let i in dataItemList){
        for(let j in resIndexData){
          if(dataItemList[i].type == resIndexData[j].type){
            dataItemList[i]['data'] = resIndexData[j].data
          }
        }
      }
      console.log(result.data);
      _this.setData(result.data);
      // 回调函数
      typeof callback === 'function' && callback();
    });
  },
  /**
   * 获取首页数据
   */
  getIndexPage(){
    let _this = this;
    App._get('page/indexData', {
     
    }, function(result) {
      // 获取首页数据
      _this.setData({
        resItem: result.data
      })
      _this.getPageData();
    
    });
  },
  /**
   * 设置顶部导航栏
   */
  setPageBar: function(page) {
    // 设置页面标题
    wx.setNavigationBarTitle({
      title: page.params.title
    });
    // 设置navbar标题、颜色
    wx.setNavigationBarColor({
      frontColor: page.style.titleTextColor === 'white' ? '#ffffff' : '#000000',
      backgroundColor: page.style.titleBackgroundColor
    })
  },

  /**
   * 分享当前页面
   */
  onShareAppMessage() {
    let _this = this;
    return {
      title: _this.data.page.params.share_title,
      path: "/pages/home/index?" + App.getShareUrlParams()
    };
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh: function() {
    // 获取首页数据
    this.getPageData(function() {
      wx.stopPullDownRefresh();
    });
  },
  /**
   * 点击生成商品海报
   */
  onClickShareItem() {
    let _this = this;
      // 显示商品海报
      _this._showPoster();
    // _this.onCloseShare();
  },

  /**
   * 关闭分享选项
   */
  onCloseShare() {
    let _this = this;
    _this.setData({
      'share.show': false
    });
  },

    /**
   * 切换商品海报
   */
  onTogglePopup() {
    let _this = this;
    _this.setData({
      'share.showPopup': !_this.data.share.showPopup
    });
  },

  /**
   * 显示商品海报图
   */
  _showPoster() {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    });
    App._get('user.dealer.qrcode/poster', {
      // goods_id: _this.data.goods_id
    }, (result) => {
      _this.setData({
        'share.show': true,
        'qrcode': result.data.qrcode
      }, () => {
        _this.onTogglePopup();
      });
    }, null, () => {
      wx.hideLoading();
    });
  },

  /**
   * 保存海报图片
   */
  onSavePoster(e) {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    });
    // 下载海报图片
    wx.downloadFile({
      url: _this.data.qrcode,
      success(res) {
        wx.hideLoading();
        // 图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(data) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            });
            // 关闭商品海报
            _this.onTogglePopup();
          },
          fail(err) {
            console.log(err.errMsg);
            if (err.errMsg === 'saveImageToPhotosAlbum:fail auth deny') {
              wx.showToast({
                title: "请允许访问相册后重试",
                icon: "none",
                duration: 1000
              });
              setTimeout(() => {
                wx.openSetting();
              }, 1000);
            }
          },
          complete(res) {
            console.log('complete');
            // wx.hideLoading();
          }
        })
      }
    })
  },

  onPageScroll: function (e) {
    let firstOpen = wx.getStorageSync("loadOpen");
    if (firstOpen == undefined || firstOpen == '') { 
      // this.setData({ isTiptrue: true })

      if(e.scrollTop>80){
        this.setData({isTiptrue: false})
      }else{
        this.setData({isTiptrue: true})
      }  
    }else {      
      this.setData({ isTiptrue: false })    
    }

  },
  goQuestion:function(){
    wx.navigateTo({
      url: '../questionnaire/start',
    })
  },
    /**
   * 显示/隐藏 返回顶部按钮
   */
  scroll(e) {
    let _this = this;
    let systemInfo = wx.getSystemInfoSync(),
      scrollHeight = systemInfo.windowHeight;
    _this.setData({
      showFixedNav: e.detail.scrollTop > scrollHeight
    })
  },
  // /**
  //  * 返回顶部
  //  */
  // goTop: function(t) {
  //   this.setData({
  //     scrollTop: 0
  //   });
  // },

  // scroll: function(t) {
  //   this.setData({
  //     indexSearch: t.detail.scrollTop
  //   }), t.detail.scrollTop > 300 ? this.setData({
  //     floorstatus: !0
  //   }) : this.setData({
  //     floorstatus: !1
  //   });
  // },

  
  
});