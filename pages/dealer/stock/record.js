const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

    deliver_type: 0, // 订单类型(0.全部 10.发货订单 20.自提订单)
    deliver_status: 0, //订单状态(0.全部 10.代发货 20.待收货 30.已取消 40.已完成)
    list: [], // 订单列表
    scrollHeight: null, // 列表容器高度
    
    has_more: true,
    no_more: false, // 没有更多数据
    isLoading: true, // 是否正在加载中

    page: 1, // 当前页码

    showQRCodePopup: false, // 核销码弹窗显示隐藏
    QRCodeImage: '', // 核销码图片

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
      deliver_status: options.type || 0
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
   * 获取提货发货列表
   */
  getSaleList(isPage, page) {
    let _this = this;
    App._get('user.goods/orderLists', {
      page: page || 1,
      deliver_type: _this.data.deliver_type,
      deliver_status: _this.data.deliver_status,
      size: 5
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
      deliver_status: e.currentTarget.dataset.type,
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
  // navigateToDetail(e) {
  //   let order_id = e.currentTarget.dataset.id;
  //   wx.navigateTo({
  //     url: '../order/detail?order_id=' + order_id
  //   });
  // },

  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },

  /**
   * 下拉到底加载数据
   */
  bindDownLoad() {
    if(this.data.no_more == true){
      this.setData({
        has_more: true
      });
      return false;
    }else{
      this.getSaleList(true, ++this.data.page);
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
  },
  /**
   * 查看物流状态
   */
  checkExpress(e){
    wx.navigateTo({
      url: './express?deliver_id='+e.currentTarget.dataset.id,
    })
  },
  /**
   * 确认收货
   */
  confirmTrans(e){
    let _this = this;
    let params = {
      deliver_id:e.currentTarget.dataset.id
    }
    wx.showModal({
      title: '友情提示',
      content: '确认收货吗？',
      success (res) {
        if (res.confirm) {
          App._post_form('user.goods/complete', params, result => {
            console.log(result);
            App.showSuccess("确认收货成功");
            _this.getSaleList();
          }, result => {}, () => {
           
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  checkQrcode(e){
    console.log(e);
    let _this = this,
    order_id = e.currentTarget.dataset.id,
    order_type = 40;
    // 调用后台api获取核销二维码
    wx.showLoading({
      title: '加载中',
    });
    App._get('user.order/extractQrcode', {
      order_id,
      order_type
    }, (result) => {
      // 设置二维码图片路径
      _this.setData({
        QRCodeImage: result.data.qrcode
      });
      // 显示核销二维码
      _this.onToggleQRCodePopup();
    }, null, () => {
      wx.hideLoading();
    });
  },
   /**
   * 核销码弹出层
   */
  onToggleQRCodePopup() {
    let _this = this;
    _this.setData({
      showQRCodePopup: !_this.data.showQRCodePopup
    });
  },


});