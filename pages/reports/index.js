//获取应用实例
const App = getApp()

// 工具类
const util = require('../../utils/util.js');

Page({
  data: {
    isLogin: false,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    productList: [],
    activeIndex: '',
    isLoading: true,
    tabList: [
      {
        text: '我的报告',
        value: 10
      },
      {
        text: 'Ta的报告',
        value: 20
      }
    ],
    dataType: 10  //报告类型：10 我的 20 他人的
  },

  onShow: function () {
    // 设置数据类型
    this.setData({
      isLogin: App.checkIsLogin()
    });

    if(this.data.isLogin){
      this.getReportList();
    }
  },
  /**
   * 获取报告列表
   */
  getReportList(){
    let _this = this;
    App._get('questionnaire/myReportList', {
      type: _this.data.dataType
    }, function(result) {
      console.log(result);
      let resList =result.data.list
      for(let k in resList){
        resList[k]['createTime'] = util.timestampToDate(resList[k]['create_time_int'])
      }
      _this.setData({
        isLoading: false,
        productList: resList
      })

    })
  },
  /**
   * 选择报告类型
   */
  swichNav(e){
    this.setData({
      dataType: e.currentTarget.dataset.current
    })
    this.getReportList();
  },

  /**
   *
   * 显示删除按钮
   */
  showDeleteButton: function (e) {
    let productIndex = e.currentTarget.dataset.productindex;
  
      this.setXmove(productIndex, -65)

   
  },

  /**
   * 隐藏删除按钮
   */
  hideDeleteButton: function (e) {
    let productIndex = e.currentTarget.dataset.productindex
    
    this.setXmove(productIndex, 0)
    
  },

  /**
   * 设置movable-view位移
   */
  setXmove: function (productIndex, xmove) {
    let productList = this.data.productList
    productList[productIndex].xmove = xmove

    this.setData({
      productList: productList
    })
  },

  /**
   * 处理movable-view移动事件
   */
  handleMovableChange: function (e) {
    if (e.detail.source === 'friction') {
      if (e.detail.x < -30) {
        this.showDeleteButton(e)
      } else {
        this.hideDeleteButton(e)
      }
    } else if (e.detail.source === 'out-of-bounds' && e.detail.x === 0) {
      this.hideDeleteButton(e)
    }
  },

  /**
   * 处理touchstart事件
   */
  handleTouchStart(e) {
    this.startX = e.touches[0].pageX
  },

  /**
   * 处理touchend事件
   */
  handleTouchEnd(e) {
    if(e.changedTouches[0].pageX < this.startX && e.changedTouches[0].pageX - this.startX <= -30) {
      this.showDeleteButton(e)
    } else if(e.changedTouches[0].pageX > this.startX && e.changedTouches[0].pageX - this.startX < 30) {
      this.showDeleteButton(e)
    } else {
      this.hideDeleteButton(e)
    }
  },

  /**
   * 删除产品
   */
  handleDeleteProduct: function (e) {
    console.log(e.currentTarget.dataset.id);
    let _this = this;
    // let productIndex = productList.findIndex(item => item.id === id)
    wx.showModal({
      title: "提示",
      content: "您确定要移除当前报告吗?",
      success: function(o) {
        o.confirm && App._post_form('questionnaire/delReport  ', {
          fill_id:e.currentTarget.dataset.id
        }, function(result) {
          _this.getReportList();
        });
      }
    });

  },

  /**
   * slide-delete 删除产品
   */
  handleSlideDelete({ detail: { id } }) {
    let slideProductList = this.data.slideProductList
    let productIndex = slideProductList.findIndex(item => item.id === id)

    slideProductList.splice(productIndex, 1)

    this.setData({
      slideProductList
    })
  },

  /**
   * 跳转详情
   */
  toReportDetail(e){
    wx.navigateTo({
      url: '../report/report?fill_id='+e.currentTarget.dataset.id,
    })
  },
  /**
   * 填写表单
   */
  toQuestion(){
    wx.navigateTo({
      url: '/pages/questionnaire/start',
    })
  },
   /**
   * 点击登录
   */
  toLogin(){
    wx.navigateTo({
      url: '../login/login',
    });
  }
})