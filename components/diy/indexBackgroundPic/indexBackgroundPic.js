const App = getApp();

Component({

  options: {

  },

  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    itemIndex: String,
    itemStyle: Object,
    params: Object,
    dataList: Object,
    bannerList: Object,
    height:{
      type: Number,
      value: true
    }
  },
    /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    // banner轮播组件属性
    indicatorDots: false, // 是否显示面板指示点	
    autoplay: true, // 是否自动切换
    duration: 800, // 滑动动画时长

    imgHeights: [], // 图片的高度
    imgCurrent: 0, // 当前banne所在滑块指针
    active_dot: '#E3C1A1',//选中背景
  },

  lifetimes:{
    ready(){
      let systemInfo = wx.getSystemInfoSync(),
      rpx = systemInfo.windowWidth / 750, // 计算rpx
      // tapHeight = Math.floor(rpx * 88), // tap高度
      scrollHeight = systemInfo.windowHeight; // swiper高度
      this.setData({height: scrollHeight})
    }
  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
  

    /**
     * 记录当前指针
     */
    _bindChange: function(e) {
      this.setData({
        imgCurrent: e.detail.current
      });
    },
    /**
     * 跳转到送礼
     */
    sendGift(){
      wx.navigateTo({
        url: '/pages/questionnaire/send/send',
      })
    },
    /**
     * 跳转到指定页面
     */
    navigationTo: function(e) {
      App.navigationTo(e.currentTarget.dataset.url);
    },

  },
 
})