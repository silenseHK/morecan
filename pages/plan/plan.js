const App = getApp();

// 工具类
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    isLogin: false,
       // 授权登录
       share: {
        show: true,
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
        showPopup: false
      },
    // 选择的商品
    checkedData: [],


    // 商品总价格
    cartTotalPrice: '0.00',


    plan:[],
    saveTips: '',
    isLoading: true,
    plan_goods_price: '',
    suggestionId: '',
    bmi: '',
    goods_num: 1, // 商品数量
    customIndex: '', //自定义索引
    goods_price: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      bmi: options.bmi?parseFloat(options.bmi):0
    })
    this.setData({
      isLogin: App.checkIsLogin()
    });

     // 获取套餐列表
    this.getCartList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      isLogin: App.checkIsLogin(),
      'share.showPopup': !App.checkIsLogin()
    })
  },

  /**
   * 获取购物车列表
   */
  getCartList() {
    let _this = this;
    App._get('questionnaire/buySuggestion', {}, result => {
      let resList = result.data.list;
      _this.setData({
        plan: resList,
        goods_price: resList[resList.length-1].goods_price
        // saveTips: resList[_this.data.currentIndex].title,
        // goods_num: resList[_this.data.currentIndex].num,
        // goods_price: resList[_this.data.currentIndex].goods_price,
        //   // 商品id
        // goods_id: resList[_this.data.currentIndex].goods_id,
        // spec_sku_id: ""
      })
      _this._initGoodsChecked(result.data);
    });
  },

  /**
   * 初始化商品选中状态
   */
  _initGoodsChecked(data) {
    let _this = this;
    // let checkedData = _this.getCheckedData();
    
    // 将商品设置选中
    data.list.forEach(item => {
      //通过bmi获取相应套餐
      if(_this.data.bmi>item.min_bmi && _this.data.bmi<=item.max_bmi){
        item.checked = true
      }
      item.goods_price = parseInt(item.goods_price);

    });
    _this.setData({
      plan: data.list,
      customIndex: data.list.length-1
    });
    // 更新已选商品总价格
    _this.updateTotalPrice();
  },

  /**
   * 选择框选中
   */
  onChecked(e) {

    let _this = this,
      indexPlan = e.currentTarget.dataset.index,
      goods = _this.data.plan[indexPlan],
      checked = true;
      // checked = !goods.checked;
    // 选中状态
    // _this.setData({
    //   ['plan[' + index + '].checked']: checked
    // });
    _this.data.plan.forEach((item,index) => {
      if(indexPlan == index){
          _this.data.plan[index].checked = checked;
      }else{
        _this.data.plan[index].checked = false;
      }
    });
    _this.setData({
      plan: _this.data.plan,
    });

    // 更新购物车已选商品总价格

    _this.updateTotalPrice(indexPlan);
  },


  /**
   * 获取已选中的商品
   */
  getCheckedIds() {
    let _this = this;
    let arrIds = [];
    _this.data.plan.forEach(item => {
      if (item.checked === true) {
        arrIds.push(`${item.goods_id}_${item.goods_sku_id}`);
      }
    });
    return arrIds;
  },
  /**
   * 获取已选中商品参数
   */
  getCeckedParams(){
    let _this = this;
    let params = {};
    _this.data.plan.forEach((item,index) => {
      if (item.checked === true) {
          params={
            order_type: 'buyNow',
            goods_id: item.goods_id,
            goods_num: index==_this.data.customIndex?_this.data.goods_num:item.num,
            goods_sku_id: item.spec.spec_sku_id,
          }
      }
    });
    return params;
  },

  /**
   * 更新购物车已选商品总价格
   */
  updateTotalPrice(index) {
    let _this = this;
    let cartTotalPrice = 0;
    let saveMoney = 0;
    let goodsPayNum = 0;

    if(index === _this.data.customIndex){
      //自定义数量更新价格
      cartTotalPrice = _this.mathMul(_this.data.goods_price,_this.data.goods_num);
      let priceDiff = _this.mathsub(_this.data.plan[index].spec.goods_price,_this.data.goods_price);
      saveMoney = _this.mathMul(priceDiff,_this.data.goods_num);
      goodsPayNum = _this.data.goods_num;
    }else{
      _this.data.plan.forEach((item) => {

        if (item.checked === true) {
          let priceDiff = _this.mathsub(item.spec.goods_price,item.goods_price);
          saveMoney = _this.mathMul(priceDiff,item.num);
          cartTotalPrice = _this.mathMul(item.goods_price,item.num)
          goodsPayNum = item.num
        }
      });

    }

    _this.setData({
      cartTotalPrice: Number(cartTotalPrice).toFixed(2),
      saveMoney:  Number(saveMoney).toFixed(2),
      goodsPayNum: goodsPayNum
    });
   
  },

  /**
   * 递增指定的商品数量
   */
  onAddCount(e) {
    let _this = this;

    _this.setData({
      goods_num: ++_this.data.goods_num
    })

    _this.getAgentOrderInfo(e);
  },

  /**
   * 递减指定的商品数量
   */
  onSubCount(e) {
    let _this = this;
    if (_this.data.goods_num > 1) {
      _this.setData({
        goods_num: --_this.data.goods_num
      });
    }
    _this.getAgentOrderInfo(e);

  },

    /**
   * 自定义输入商品数量
   */
  onInputGoodsNum(e) {
    let _this = this,
      iptValue = e.detail.value;
    if (!util.isPositiveInteger(iptValue) && iptValue !== '') {
      iptValue = 1;
    }
    if (iptValue == '') {
      iptValue = 1;
    }
    _this.setData({
      goods_num: iptValue
    });

    
    _this.getAgentOrderInfo(e);

  },

    /**
   * 根据代理选择数量更新价格
   * @param goodsNum 
   */
  getAgentOrderInfo(e){
    let _this = this,
    index = e.currentTarget.dataset.index,
    item = _this.data.plan[index];
      //代理商品获取价格
      App._get('goods/getAgentGoodsPriceStock', {
        goods_id: item.goods_id,
        goods_sku_id: item.goods_sku_id,
        num: _this.data.goods_num
      }, (result) => {
          _this.setData({
            goods_price: result.data.price
            // goods_num: _this.data.goods_num
          })
          _this.onChecked(e);
      },(res)=>{

        if(res.data.code === 0){
          return false;
        }
      });
  },


  /**
   * 购物车结算
   */
  submit() {
    let _this = this,
      cartIds = _this.getCheckedIds(),
      params = _this.getCeckedParams();
      console.log(params);
    if (!cartIds.length) {
      App.showError('您还没有选择商品');
      return false;
    }

    wx.navigateTo({
      url: '../flow/checkout?' + util.urlEncode(params),
      success() {
      
      }
    });

  },

  /**
   * 加法
   */
  mathadd(arg1, arg2) {
    return (Number(arg1) + Number(arg2)).toFixed(2);
  },

  /**
   * 减法
   */
  mathsub(arg1, arg2) {
    return (Number(arg1) - Number(arg2)).toFixed(2);
  },
  /**
   * 乘法
   */
  mathMul(arg1,arg2){
    return (Number(arg1) * Number(arg2)).toFixed(2);
  },

  /**
   * 去购物
   */
  goShopping() {
    wx.switchTab({
      url: '../index/index',
    });
  },

     /**
   * 验证是否已登录
   */
  onCheckLogin() {
    let _this = this;
    if (!_this.data.isLogin) {
      // App.showError('很抱歉，您还没有登录');
      return false;
    }
    return true;
  },
  /**
   * 去登录
   */
  toLogin(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  /**
   * 暂不登录
   */
  onCloseLogin() {
    let _this = this;
    _this.setData({
      'share.showPopup': false
    });
  },
  /**
   * 分享当前页面
   */
  onShareAppMessage() {
    // 构建页面参数
    let params = App.getShareUrlParams();
    console.log(params);
    return {
      path: "/pages/plan/plan?" + params
    };
  },

})