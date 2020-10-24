const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

    order_type: 0, // 列表类型  0.全部；10.待发货；20.待收货；30.已完成
    list: [], // 订单列表
    scrollHeight: null, // 列表容器高度
    
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
      dataType: options.type || 0
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 获取销售列表
    this.getSaleList();
  },

  /**
   * 获取销售列表
   */
  getSaleList(isPage, page) {
    let _this = this;
    App._get('user.order/agentSaleGoodsLists', {
      page: page || 1,
      order_type: _this.data.order_type,
      size: 6
    }, result => {
      //如果为空不加载
      if(result.data.length <= 0){
        _this.setData({
          no_more: true,
          isLoading: false,
          has_more: false
        })
        return false;
      }
      let resList = result.data,
        dataList = _this.data.list;
      if (isPage == true) {
        _this.setData({
          'list': dataList.concat(resList),
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
      order_type: e.currentTarget.dataset.type,
      list: {},
      isLoading: true,
      page: 1,
      no_more: false,
    });
    // 获取订单列表
    this.getSaleList();
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
    let _this = this;
    if (_this.data.no_more == true) {
      _this.setData({
        has_more: true
      });
      return false;
    }else{
      // 加载下一页列表
      _this.getSaleList(true, ++this.data.page);
    }
  },

  /**
   * 设置商品列表高度
   */
  setListHeight() {
    let systemInfo = wx.getSystemInfoSync(),
      rpx = systemInfo.windowWidth / 750, // 计算rpx
      tapHeight = Math.floor(rpx * 100), // tap高度
      scrollHeight = systemInfo.windowHeight - tapHeight; // swiper高度
    this.setData({
      scrollHeight
    });
  }


});