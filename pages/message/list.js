const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

    type: 0, // 列表类型  0.全部；10.待发货；20.待收货；30.已完成
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
    wx.setNavigationBarTitle({
      title: options.name
    })
    // 设置scroll-view高度
    _this.setListHeight();
    // 设置数据类型
    _this.setData({
      type: options.type || 0
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 获取消息列表
    this.getMessageList();
  },

  /**
   * 获取消息列表
   */
  getMessageList(isPage, page) {
    let _this = this;
    App._get('user.message/lists', {
      page: page || 1,
      type: _this.data.type,
      size: 6
    }, result => {
      console.log(result.data);
      //如果为空不加载
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
      _this.getMessageList(true, ++this.data.page);
    }
  },

  /**
   * 设置商品列表高度
   */
  setListHeight() {
    let systemInfo = wx.getSystemInfoSync(),
      scrollHeight = systemInfo.windowHeight; // swiper高度
    this.setData({
      scrollHeight
    });
  }


});