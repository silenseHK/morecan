const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

    list: [], // 订单列表

    no_more: false, // 没有更多数据
    isLoading: true, // 是否正在加载中


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 获取订单列表
    this.getStockList();
  },

  /**
   * 获取订单列表
   */
  getStockList(isPage, page) {
    let _this = this;
    App._get('user.goods/lists', {

    }, result => {
      let dataList = _this.data.list;
      _this.setData({
        list: result.data
      })
    });
  },



 /**
   * 补充库存
   */
  supplyGoods(e) {
    let goods_id = e.currentTarget.dataset.id;
    let spec_id = e.currentTarget.dataset.specId;

    if(goods_id=='list'){
      wx.navigateTo({
        url: '/pages/custom/index?page_id=10002'
      });
    }else{
      wx.navigateTo({
        url: '../../goods/index?goods_id=' + goods_id+'&spec_id='+ spec_id
      });
    }
  },


  /**
   * 提货发货
   */
  sendGoods(e) {
    let goods_id = e.currentTarget.dataset.id,
        goods_sku_id = e.currentTarget.dataset.skuId;
    
    wx.navigateTo({
      url: './send?goods_id=' + goods_id+'&goods_sku_id='+goods_sku_id
    });
  },



});