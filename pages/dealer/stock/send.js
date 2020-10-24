const App = getApp();

// 工具类
import Util from '../../../utils/util.js';

// 验证类
import Verify from '../../../utils/verify.js';

// 枚举类：发货方式
import DeliveryTypeEnum from '../../../utils/enum/DeliveryType.js';

// 枚举类：支付方式
import PayTypeEnum from '../../../utils/enum/order/PayType';

// 对话框插件
import Dialog from '../../../components/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 当前页面参数
    options: {},

    //库存信息
    stock_info: '',

    // 配送方式
    // isShowTab: false,
    DeliveryTypeEnum,
    // curDelivery: null,
    curDelivery: 10,  //默认快递
    // 支付方式
    PayTypeEnum,
    curPayType: PayTypeEnum.WECHAT.value,

    address: null, // 默认收货地址
    exist_address: false, // 是否存在收货地址

    selectedShopId: 0, // 选择的自提门店id
    linkman: '', // 自提联系人
    phone: '', // 自提联系电话
    stocknum: '', //提货数量
    tranPay: '', //运费

    // 商品信息
    goods: {},

    // 是否使用积分抵扣
    // isUsePoints: false,

    // 买家留言
    remark: '',

    // 禁用submit按钮
    disabled: false,

    hasError: false,
    error: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this;
    // 当前页面参数
    _this.data.options = options;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let _this = this;
    // 获取当前订单信息
    // _this.getOrderData();
    _this.getStockData();
    
  },
  /**
   *  获取商品信息
   */
  getStockData(){
    let _this = this,
    options = _this.data.options;
    // 获取订单信息回调方法
    let callback = result => {

      let resData = result.data;

      let data = {};

      data.address = resData.user.address_default;

      if(resData.user.address.length>0){
        data.exist_address = true;
      }
     
      // 设置页面数据
      _this.setData(Object.assign({}, resData, data));
      wx.hideLoading();
    }
    // 请求错误
    // if (result.code !== 1) {
    //   App.showError(result.msg);
    //   return false;
    // }
     wx.showLoading({
      title: '加载中...',
    });
    
    let params = {
      goods_sku_id: options.goods_sku_id || 0,
      shop_id: _this.data.selectedShopId || 0,
    };

    // 立即购买

      App._get('user.goods/supply', Object.assign({}, params), result => {
        callback(result);
      });
    

  },

  /**
   * 获取当商品信息
   */
  getOrderData(){
    let _this = this,
      options = _this.data.options;
    // 获取订单信息回调方法
    let callback = result => {
      let resData = result.data;
      // 请求错误
      if (result.code !== 1) {
        App.showError(result.msg);
        return false;
      }
      // 显示错误信息
      if (resData.has_error) {
        _this.data.hasError = true;
        _this.data.error = resData.error_msg;
        App.showError(_this.data.error);
      }

      let data = {};
      data.isShowTab = true;
      data.curDelivery = resData.delivery;
      // 当前选择的配送方式  sale_type等于1层级代理 2为平台直营商品
      // if(resData.grade_id<=3 && resData.goods_list[0].sale_type==2)
      
     
      // 如果只有一种配送方式则不显示选项卡
      // data.isShowTab = resData.setting.delivery.length > 1;
      //当配送方式为30（补充库存）时不显示选项卡
      // data.isShowTab = resData.delivery_type != 30;
      // 上门自提联系信息
      
      if (_this.data.linkman === '') {
        data.linkman = resData.last_extract.linkman;
      }
      if (_this.data.phone === '') {
        data.phone = resData.last_extract.phone;
      }
      // 设置页面数据
      _this.setData(Object.assign({}, resData, data));
      wx.hideLoading();
    };

    // wx.showLoading({
    //   title: '加载中...',
    // });

    // 请求的参数
    let params = {
      delivery: _this.data.curDelivery || 0,
      shop_id: _this.data.selectedShopId || 0,
      coupon_id: _this.data.selectCouponId || 0,
      is_use_points: _this.data.isUsePoints ? 1 : 0,
    };

    // 立即购买
    if (options.order_type === 'buyNow') {
      App._get('order/buyNow', Object.assign({}, params, {
        goods_id: options.goods_id,
        goods_num: options.goods_num,
        goods_sku_id: options.goods_sku_id,
      }), result => {
        callback(result);
      });
    }
  },

  /**
   * 切换配送方式
   */
  onSwichDelivery(e) {
    // 设置当前配送方式
    let _this = this,
      curDelivery = e.currentTarget.dataset.current;
      _this.setData({
        curDelivery
      });

      //获取运费
      // _this.getTranPay();
    // 重新获取订单信息
    // _this.getOrderData();
  },

  /**
   * 快递配送：选择收货地址
   */
  onSelectAddress() {
    wx.navigateTo({
      url: '../../address/' + (this.data.exist_address ? 'index?from=flow' : 'create')
    });
  },

  /**
   * 上门自提：选择自提点
   */
  onSelectExtractPoint() {
    let _this = this,
      selectedId = _this.data.selectedShopId;
    wx.navigateTo({
      url: '../../_select/extract_point/index?selected_id=' + selectedId
    });
  },


  /**
   * 跳转到商品详情页
   */
  onTargetGoods(e) {
    wx.navigateTo({
      url: `../../goods/index?goods_id=${e.currentTarget.dataset.id}`,
    })
  },

  /**
   * 订单提交
   */
  onSubmitOrder() {
    let _this = this,
      options = _this.data.options;

    if (_this.data.disabled) {
      return false;
    }

    // 表单验证
    if (!_this._onVerify()) {
      return false;
    }

    if (Verify.isEmpty(_this.data.stocknum)) {
      App.showError('请输入提货数量');
      return false;
    }

    // 订单创建成功后回调--微信支付
    let callback = result => {
      //支付错误
      if (result.code === 0) {
        App.showError(result.msg, () => {
          _this.redirectToOrderIndex();
        });
        return false;
      }

      if(result.data.freight == 0){
          App.showSuccess(result.msg, () => {
            _this.redirectToOrderIndex();
          });
      }
      // 发起微信支付
 
        App.wxPayment({
          payment: result.data.payment,
          success: res => {
            _this.redirectToOrderIndex();
          },
          fail: res => {
            App.showError(result.msg.error, () => {
              _this.redirectToOrderIndex();
            });
          },
        });
      

       
      // 余额支付
      // if (result.data.pay_type == PayTypeEnum.BALANCE.value) {
      //   App.showSuccess(result.msg.success, () => {
      //     _this.redirectToOrderIndex();
      //   });
      // }
    };

    // 按钮禁用, 防止二次提交
    _this.data.disabled = true;

    // 显示loading
    wx.showLoading({
      title: '正在处理...'
    });


    let url = '';

    // 表单提交的数据
    // let postData = {
    //   delivery: _this.data.curDelivery,
    //   pay_type: _this.data.curPayType,
    //   shop_id: _this.data.selectedShopId || 0,
    //   linkman: _this.data.linkman,
    //   phone: _this.data.phone,
    //   coupon_id: _this.data.selectCouponId || 0,
    //   is_use_points: _this.data.isUsePoints ? 1 : 0,
    //   remark: _this.data.remark || '',
    // };
    // 创建提货发货订单
      let postData = {
        address_id: _this.data.address==null?1:_this.data.address.address_id,
        goods_id: options.goods_id,
        goods_sku_id: options.goods_sku_id,
        goods_num: _this.data.stocknum,
        deliver_type: _this.data.curDelivery,
        shop_id: _this.data.selectedShopId,
        receiver_user: _this.data.linkman,
        receiver_mobile: _this.data.phone
      };



    // 提货订单提交
    App._post_form('user.goods/apply', postData, result => {
      callback(result);
    }, result => {}, () => {
      wx.hideLoading();
      // 解除按钮禁用
      _this.data.disabled = false;
    });

  },

  /**
   * 表单验证
   */
  _onVerify() {
    let _this = this;
    // 验证自提填写的联系方式
    if (_this.data.curDelivery == DeliveryTypeEnum.EXTRACT.value) {
      _this.setData({
        linkman: _this.data.linkman.trim(),
        phone: _this.data.phone.trim(),
      });
      if (_this.data.selectedShopId <= 0) {
        App.showError('请选择自提的门店');
        return false;
      }
      if (Verify.isEmpty(_this.data.linkman)) {
        App.showError('请填写自提联系人');
        return false;
      }
      if (Verify.isEmpty(_this.data.phone)) {
        App.showError('请填写自提联系电话');
        return false;
      }
      if (!Verify.isPhone(_this.data.phone)) {
        App.showError('请输入正确的联系电话');
        return false;
      }
    }

    return true;
  },

  /**
   * 买家留言
   */
  bindRemark(e) {
    let _this = this;
    _this.setData({
      remark: e.detail.value
    })
  },


 

  /**
   * 选择支付方式
   */
  onSelectPayType(e) {
    let _this = this;
    // 记录formId
    App.saveFormId(e.detail.formId);
    // 设置当前支付方式
    _this.setData({
      curPayType: e.currentTarget.dataset.value
    });
  },

  /**
   * 跳转到未付款订单
   */
  redirectToOrderIndex() {
    wx.redirectTo({
      url: './record',
    });
  },

  /**
   * input绑定：联系人
   */
  onInputLinkman(e) {
    let _this = this;
    _this.setData({
      linkman: e.detail.value
    });
  },

  /**
   * input绑定：联系电话
   */
  onInputPhone(e) {
    let _this = this;
    _this.setData({
      phone: e.detail.value
    });
  },

   /**
   * input绑定：提货数量
   */
  onInputStockNum(e) {
    let _this = this;
    if(_this.data.curDelivery == DeliveryTypeEnum.EXPRESS.value){
      // 当为物流时表单验证，计算运费
      if (!_this._onVerify()) {
        // return false;
        return '';
      }
    }

    _this.setData({
      stocknum: e.detail.value
    });
    if(_this.data.curDelivery === 10){
      _this.getTranPay();
    }
  
  },
    /**
   * 获取运费
   */
  getTranPay(){
    let _this = this;
    // 表单验证
    if (_this.data.curDelivery == DeliveryTypeEnum.EXPRESS.value) {
      if ( _this.data.address==null) {
        App.showError('请先选择配送地址');
        return false;
      }
    }

      App._get('user.goods/countFreight', {
        goods_id: _this.data.goods_data.goods_id,
        address_id: _this.data.address.address_id,
        goods_num: _this.data.stocknum
      }, result => {
        _this.setData({
          tranPay: result.data.freight
        });
      });
    
  }


});