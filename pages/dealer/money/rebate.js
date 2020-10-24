const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

    type: 20, //10.货款 20.返利佣金
    list: [], // 订单列表
    scrollHeight: null, // 列表容器高度
    inputValue: '',
    todayDate: '',
    startDate: '',
    endDate: '',
    total_income:'',

    has_more: true,
    no_more: false, // 没有更多数据
    isLoading: true, // 是否正在加载中

    page: 1, // 当前页码

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this;
    // 设置scroll-view高度
    _this.setListHeight();
    // 设置数据类型
    _this.setData({
      dataType: options.type || 'all'
    });
    // 获取订单列表
    this.getOrderList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      todayDate: App.getTodayDate()
    })
  },

  /**
   * 获取订单列表
   */
  getOrderList(isPage, page) {
    let _this = this;
    App._get('user.wallet/incomeList', {
      type: _this.data.type,
      keywords: _this.data.inputValue,
      start_time: _this.data.startDate,
      end_time: _this.data.endDate,
      size: 10,
      page: page||1
    }, result => {
      _this.setData({
        total_income: result.data.total_income
      })
      if(result.data.list.length <= 0){
        _this.setData({
          no_more: true,
          isLoading: false,
          has_more: false
        })
        return false;
      }
      let resList = result.data.list,
        dataList = _this.data.list;
      if (isPage == true) {
        _this.setData({
          list: dataList.concat(resList),
          isLoading: false,
          has_more: true
        });
      } else {
        _this.setData({
          list: resList,
          isLoading: false,
          has_more: true
        });
      }
    });
  },
  /**
   * 切换标签
   */
  bindHeaderTap(e) {
    this.setData({
      dataType: e.currentTarget.dataset.type,
      list: {},
      isLoading: true,
      page: 1,
      no_more: false,
    });
    // 获取订单列表
    this.getOrderList(e.currentTarget.dataset.type);
  },


  /**
   * 跳转订单详情页
   */
  navigateToDetail(e) {
    let order_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../order/detail?order_id=' + order_id
    });
  },

  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },

  /**
   * 下拉到底加载数据
   */
  bindDownLoad() {
    // 已经是最后一页
    // if (this.data.page >= this.data.list.last_page) {
    //   this.setData({
    //     no_more: true
    //   });
    //   return false;
    // }
    // 加载下一页列表
    if(this.data.no_more == true){
      this.setData({
        has_more: true
      });
      return false;
    }else{
      this.getOrderList(true, ++this.data.page);
    }
  },

  /**
   * 设置商品列表高度
   */
  setListHeight() {
    let systemInfo = wx.getSystemInfoSync(),
      rpx = systemInfo.windowWidth / 750, // 计算rpx
      tapHeight = Math.floor(rpx * 88), // tap高度
      scrollHeight = systemInfo.windowHeight - tapHeight; // swiper高度
    this.setData({
      scrollHeight
    });
  },
  /**
   * 获取搜索的值 
   */
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  /**
   * 选择开始日期
   */
  bindStartDateChange: function (e) {
    this.setData({
      startDate: e.detail.value
    })
  },
  /**
   * 选择结束日期
   */
  bindEndDateChange: function (e) {
    if(this.data.startDate == '' || this.data.startDate==undefined){
      App.showError('请先选择开始时间');
      return false;
    }
    if(App.dateToTimeTamp(this.data.startDate)>App.dateToTimeTamp(e.detail.value)){
      App.showError('开始时间要早于结束时间哦');
      return false;
    }
    this.setData({
      endDate: e.detail.value
    })
  },
  /**
   * 搜索提交
   */
  formSubmit(){
    this.setData({
      list: {},
      isLoading: true,
      page: 1,
      no_more: false,
    });
    this.getOrderList();
  }

});