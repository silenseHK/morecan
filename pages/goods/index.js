const App = getApp();

// 富文本插件
const wxParse = require("../../wxParse/wxParse.js");

// 倒计时插件
import CountDown from '../../utils/countdown.js';

// 工具类
const util = require('../../utils/util.js');

// 记录规格的数组
let goodsSpecArr = [];

Page({

  /**
   * 页面的初始数据
   */
  data: {

    isLogin: false,
    sale_type: '',  //1是代理产品，2是平台直营
    indicatorDots: false, // 是否显示面板指示点
    autoplay: true, // 是否自动切换
    interval: 3000, // 自动切换时间间隔
    duration: 800, // 滑动动画时长

    currentIndex: 1, // 轮播图指针
    floorstatus: false, // 返回顶部
    showView: true, // 显示商品规格

    is_experience: '', //是否是体验装 
    detail: {}, // 商品详情信息
    goods_price: 0, // 商品价格
    line_price: 0, // 划线价格
    //stock_num: 0, // 库存数量

    goods_num: 1, // 商品数量
    goods_sku_id: 0, // 规格id
    cart_total_num: 0, // 购物车商品总数量
    goodsMultiSpec: {}, // 多规格信息
    spec: {},  //补货
    spec_sku_id: '',
    imgHeights: [], // 图片的高度
    imgCurrent: 0, // 当前banne所在滑块指针

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
      showPopup: false
    },
    showBottomPopup: false,
    prev_page: false,
    actStartTimeList: [],
    rank: {},
    planItemIndex: 0,
    isIPX: App.globalData.isIPX,  // 将全局参数值赋予当前页面
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    let _this = this,
      scene = App.getSceneData(e);
    //直播间进入购买记录上级
    let refereeId = e.referee_id;
    refereeId > 0 && (App.saveRefereeId(refereeId));
    _this.setData({
      isLogin: App.checkIsLogin()
    });
    // 商品id
    _this.data.goods_id = e.goods_id ? e.goods_id : scene.gid;
    _this.data.spec_sku_id = e.spec_id?e.spec_id:'';
    // 获取商品信息
    _this.getGoodsDetail();
  },
  onShow(){
    if(this.data.prev_page){
      this.setData({
        showBottomPopup: true
      })
    }

  },
    /**
   * 获取套餐价格及数量
   */
  getPlanData() {
    let _this = this;
    App._get('questionnaire/buySuggestion',{}, function(result) {
      let resList = result.data.list;
 
      _this.setData({
        plan: resList,
        goods_num: resList[0].num,
        goods_price: resList[0].goods_price
      })

      _this.saveMoneyChange();
    }); 
  },

    /**
     * 计算图片高度
     */
    _imagesHeight(e){
      let _this =this;
      // 获取图片真实宽度
      let imgwidth = e.detail.width,
        imgheight = e.detail.height,
        // 宽高比
        ratio = imgwidth / imgheight;
      // 计算的高度值
      let viewHeight = 750*0.94 / ratio,
        imgHeights = _this.data.imgHeights+15;
      // 把每一张图片的高度记录到数组里
      // imgHeights.push(viewHeight);
      imgHeights = viewHeight;
      _this.setData({
        imgHeights
      });
    },
     /**
     * 记录当前指针
     */
    _bindChange(e) {
      this.setData({
        imgCurrent: e.detail.current,
        currentIndex: e.detail.current + 1
      });
    },

    /**
     * 选择套餐
     */
    selectPlanItem(e){
      let _this = this,
      planIndex = e.currentTarget.dataset.index;
      this.setData({
        planItemIndex: planIndex,
        goods_num: _this.data.plan[planIndex].num,
        goods_price: _this.data.plan[planIndex].goods_price,
      })

      _this.saveMoneyChange();
    },
    /**
     * 填写问卷
     */
    toQuestion(){
      wx.navigateTo({
        url: '/pages/questionnaire/start',
      })
    },

  /**
   * 获取商品信息
   */
  getGoodsDetail() {
    let _this = this;
    App._get('goods/detail', {
      goods_id: _this.data.goods_id,
      spec_sku_id: _this.data.spec_sku_id
    }, (result) => {
      // 初始化商品详情数据
      let data = _this._initGoodsDetailData(result.data);
      _this.setData(data);

      //如果是代理补库存，初始化sku
      console.log(_this.data.spec_sku_id);
      if(_this.data.spec_sku_id && _this.data.spec_sku_id != 0){
        _this._initSupplySpecData();
      }

      if(_this.data.goods_id == 1){
         //获取套餐信息
        _this.getPlanData();
      }

      // 执行倒计时
      if (data.is_experience == 1 && data.sale_info.sale_status==2) {
        CountDown.onSetTimeList(_this, 'actStartTimeList');
      }
    });
  },

  /**
   * 初始化商品详情数据
   */
  _initGoodsDetailData(data) {
    let _this = this;
    // 商品详情
    let goodsDetail = data.detail;
    // 富文本转码
    if (goodsDetail.content.length > 0) {
      wxParse.wxParse('content', 'html', goodsDetail.content, _this, 0);
    }
    data.sale_type = goodsDetail.sale_type;
    // 商品价格/划线价/库存
    data.goods_id = goodsDetail.goods_id;
    data.goods_sku_id = goodsDetail.goods_sku.spec_sku_id;
    if(goodsDetail.sale_type==1){
      //代理商品初始化价格
      data.goods_price = goodsDetail.agent_init_price;
      data.spec = goodsDetail.spec;
    }else{
      //直营商品初始化价格
      data.goods_price = goodsDetail.goods_sku.goods_price;
    }
    data.line_price = goodsDetail.goods_sku.line_price;
    //是否是体验装 0不是 1是
    data.is_experience = goodsDetail.is_experience;
    // data.stock_num = goodsDetail.goods_sku.stock_num;
    //data.stock_num = goodsDetail.stock;
    // 商品封面图(确认弹窗)
    data.skuCoverImage = goodsDetail.goods_image;
    // 多规格商品封面图(确认弹窗)
    if (goodsDetail.spec_type == 20 && goodsDetail.goods_sku['image']) {
      data.skuCoverImage = goodsDetail.goods_sku['image']['file_path'];
    }
    // 初始化商品多规格
    if (goodsDetail.spec_type == 20) {
      data.goodsMultiSpec = _this._initManySpecData(goodsDetail.goods_multi_spec);
      // data.goodsMultiSpec = _this._initSupplySpecData(goodsDetail.goods_multi_spec,goodsDetail.spec);
    }
    //初始化购买数量
    // data.goods_num = 4;
    // 记录活动开始时间
    data.actStartTimeList = [{
      date: util.timestampToTime(data.sale_info.start_sale_time)
    }];
    return data;
  },

  /**
   * 初始化商品多规格
   */
  _initManySpecData(data) {
    goodsSpecArr = [];
    for (let i in data.spec_attr) {
      for (let j in data.spec_attr[i].spec_items) {
        if (j < 1) {
          data.spec_attr[i].spec_items[0].checked = true;
          goodsSpecArr[i] = data.spec_attr[i].spec_items[0].item_id;
        }
      }
    }
    return data;
  },

  /**
   * 补充库存初始化
   * 
   */
  _initSupplySpecData(){
    let _this = this,
    goodsMultiSpec = _this.data.goodsMultiSpec;
    for(let s in _this.data.spec){
      for (let i in goodsMultiSpec.spec_attr) {
        if(s == goodsMultiSpec.spec_attr[i].group_id)
        for (let j in goodsMultiSpec.spec_attr[i].spec_items) {
            goodsMultiSpec.spec_attr[i].spec_items[j].checked = false;
            if (_this.data.spec[s] == goodsMultiSpec.spec_attr[i].spec_items[j].item_id) {
              console.log(goodsMultiSpec.spec_attr[i].spec_items[j]);
              goodsMultiSpec.spec_attr[i].spec_items[j].checked = true;
              goodsSpecArr[i] = goodsMultiSpec.spec_attr[i].spec_items[j].item_id;
              // goodsMultiSpec.spec_attr[i].spec_items[itemIdx].checked = true;
              // goodsSpecArr[i] = goodsMultiSpec.spec_attr[i].spec_items[itemIdx].item_id;
            }
        }
      }
      
    }
    
    _this.setData({
      goodsMultiSpec
    });
    // 更新商品规格信息
    _this._updateSpecGoods();
  },

  /**
   * 点击切换不同规格
   */
  onSwitchSpec(e) {
    let _this = this,
      attrIdx = e.currentTarget.dataset.attrIdx,
      itemIdx = e.currentTarget.dataset.itemIdx,
      goodsMultiSpec = _this.data.goodsMultiSpec;
    for (let i in goodsMultiSpec.spec_attr) {
      for (let j in goodsMultiSpec.spec_attr[i].spec_items) {
        if (attrIdx == i) {
          goodsMultiSpec.spec_attr[i].spec_items[j].checked = false;
          if (itemIdx == j) {
            goodsMultiSpec.spec_attr[i].spec_items[itemIdx].checked = true;
            goodsSpecArr[i] = goodsMultiSpec.spec_attr[i].spec_items[itemIdx].item_id;
          }
        }
      }
    }
    _this.setData({
      goodsMultiSpec
    });
    // 更新商品规格信息
    _this._updateSpecGoods();
  },

  // 代理商品动态获取价格
  getAgentPice(e){
    let _this = this,
    attrIdx = e.currentTarget.dataset.attrIdx,
    itemIdx = e.currentTarget.dataset.itemIdx,
    itemNum = e.currentTarget.dataset.itemNum,
    goodsMultiSpec = _this.data.goodsMultiSpec;

    for (let i in goodsMultiSpec.spec_attr) {
      for (let j in goodsMultiSpec.spec_attr[i].spec_items) {
        if (attrIdx == i) {
          goodsMultiSpec.spec_attr[i].spec_items[j].checked = false;
          if (itemIdx == j) {
            goodsMultiSpec.spec_attr[i].spec_items[itemIdx].checked = true;
            goodsSpecArr[i] = goodsMultiSpec.spec_attr[i].spec_items[itemIdx].item_id;
          }
        }
      }
    }

    _this.setData({
      goodsMultiSpec
    });
    // _this.setData({
    //   goods_num: itemNum
    // })
    // 获取代理单价
    _this.getAgentOrderInfo();
    // _this._updateSpecGoods();

  },

  /**
   * 更新商品规格信息
   */
  _updateSpecGoods() {
    let _this = this,
      specSkuId = goodsSpecArr.join('_');
    // 查找skuItem
    let spec_list = _this.data.goodsMultiSpec.spec_list,
      skuItem = spec_list.find((val) => {
        return val.spec_sku_id == specSkuId;
      });
    // 记录goods_sku_id
    // 更新商品价格、划线价、库存
    if (typeof skuItem === 'object') {
      if(_this.data.sale_type==1){
        //代理商品
        _this.setData({
          goods_sku_id: skuItem.spec_sku_id,
          goods_price: _this.data.goods_price,
          line_price: skuItem.form.line_price,
          stock_num: skuItem.form.stock_num,
          skuCoverImage: skuItem.form.image_id > 0 ? skuItem.form.image_path : _this.data.detail.goods_image
        });
      }else{
        //直营按照正常sku
        _this.setData({
          goods_sku_id: skuItem.spec_sku_id,
          goods_price: skuItem.form.goods_price,
          line_price: skuItem.form.line_price,
          stock_num: skuItem.form.stock_num,
          skuCoverImage: skuItem.form.image_id > 0 ? skuItem.form.image_path : _this.data.detail.goods_image
        });
      }
      
    }
  },

  /**
   * 设置轮播图当前指针 数字
   */
  setCurrent(e) {
    let _this = this;
    _this.setData({
      currentIndex: e.detail.current + 1
    });
  },

  /**
   * 返回顶部
   */
  onScrollTop(t) {
    let _this = this;
    _this.setData({
      scrollTop: 0
    });
  },

  /**
   * 显示/隐藏 返回顶部按钮
   */
  scroll(e) {
    let _this = this;
    _this.setData({
      floorstatus: e.detail.scrollTop > 200
    })
  },

  /**
   * 增加商品数量
   */
  onIncGoodsNumber(e) {
    let _this = this;
    _this.setData({
      goods_num: ++_this.data.goods_num
    })
    _this.getAgentOrderInfo();
  },

  /**
   * 减少商品数量
   */
  onDecGoodsNumber(e) {
    let _this = this;
    if (_this.data.goods_num > 1) {
      _this.setData({
        goods_num: --_this.data.goods_num
      });
    }
    _this.getAgentOrderInfo();
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
    _this.setData({
      goods_num: iptValue
    });

    
    _this.getAgentOrderInfo();

  },
  /**
   * 根据代理选择数量更新价格
   * @param goodsNum 
   */
  getAgentOrderInfo(){
    let _this = this;
    if (!_this.onCheckLogin()) {
      return false;
    }
    if(_this.data.detail.sale_type == 1){
      //代理商品获取价格
      App._get('goods/getAgentGoodsPriceStock', {
        goods_id: _this.data.detail.goods_id,
        goods_sku_id: _this.data.goods_sku_id,
        num: _this.data.goods_num
      }, (result) => {
        // 设置了推荐套餐
        if(_this.data.goods_id == 1){
          let planItemIndex = _this.data.plan.length;
          _this.data.plan.forEach((item,index)=>{
            if(_this.data.goods_num == parseInt(item.num)){
              planItemIndex = index
            }
          })
          _this.setData({
            planItemIndex: planItemIndex
          })
        }
          _this.setData({
            goods_price: result.data.price,
            // goods_num: _this.data.goods_num
          })
        // 算优惠价
        // _this.saveMoneyChange();

      },(res)=>{

        if(res.data.code === 0){
          return false;
        }
      });
    }else{
      return true;
    }

  },
    /**
   * 算优惠
   */
  saveMoneyChange(){
    let _this = this;
    if(_this.data.goods_id == 1){
      let _this = this;
      let priceDiff = _this.mathsub(_this.data.plan[0].spec.goods_price,_this.data.goods_price);
      let saveMoney = _this.mathMul(priceDiff,_this.data.goods_num);
      let totalMoney = _this.mathMul(_this.data.goods_price,_this.data.goods_num)
      _this.setData({
        saveMoney: saveMoney,
        totalMoney: totalMoney
      })  
    }else{
      return false;
    }
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
   * 跳转购物车页面
   */
  onTriggerCart() {
    wx.switchTab({
      url: "../flow/index"
    });
  },

  /**
   * 加入购物车and立即购买
   */
  onConfirmSubmit(e) {
    let _this = this,
      submitType = e.currentTarget.dataset.type;
    // 表单验证
    if (!_this._onVerify()) {
      return false;
    }
    if (submitType === 'buyNow') {
      // 立即购买
      wx.navigateTo({
        url: '../flow/checkout?' + util.urlEncode({
          order_type: 'buyNow',
          goods_id: _this.data.goods_id,
          goods_num: _this.data.goods_num,
          goods_sku_id: _this.data.goods_sku_id,
        }),
        success() {
          // 关闭弹窗
          _this.onToggleTrade();
        }
      });
    } else if (submitType === 'addCart') {
      // 加入购物车
      App._post_form('cart/add', {
        goods_id: _this.data.goods_id,
        goods_num: _this.data.goods_num,
        goods_sku_id: _this.data.goods_sku_id,
      }, (result) => {
        App.showSuccess(result.msg);
        _this.setData(result.data);
      });
    }
  },

  /**
   * 表单验证
   */
  _onVerify() {
    let _this = this;
    if (_this.data.goods_num === '') {
      App.showError('请输入购买数量');
      return false;
    }
    // 将购买数量转为整型，防止出错
    _this.setData({
      goods_num: parseInt(_this.data.goods_num)
    });
    if (_this.data.goods_num <= 0) {
      App.showError('购买数量不能为0');
      return false;
    }
    return true;
  },

  /**
   * 浏览商品图片
   */
  onPreviewImages(e) {
    let _this = this;
    let index = e.currentTarget.dataset.index,
      imageUrls = [];
    _this.data.detail.image.forEach(item => {
      imageUrls.push(item.file_path);
    });
    wx.previewImage({
      current: imageUrls[index],
      urls: imageUrls
    })
  },

  /**
   * 预览Sku规格图片
   */
  onPreviewSkuImage(e) {
    let _this = this;
    wx.previewImage({
      current: _this.data.skuCoverImage,
      urls: [_this.data.skuCoverImage]
    })
  },

  /**
   * 跳转到评论
   */
  onTargetToComment() {
    let _this = this;
    wx.navigateTo({
      url: './comment/comment?goods_id=' + _this.data.goods_id
    })
  },

  /**
   * 分享当前页面
   */
  onShareAppMessage() {
    let _this = this;
    // 构建页面参数
    let params = App.getShareUrlParams({
      'goods_id': _this.data.goods_id
    });
    console.log(params);
    return {
      title: _this.data.detail.goods_name,
      path: "/pages/goods/index?" + params
    };
    console.log(params);
  },

  /**
   * 显示分享选项
   */
  onClickShare(e) {
    let _this = this;
    // 记录formId
    // App.saveFormId(e.detail.formId);
    _this.setData({
      'share.show': true
    });
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
   * 点击生成商品海报
   */
  onClickShareItem(e) {
    let _this = this;
    if (e.detail.index === 0) {
      // 显示商品海报
      _this._showPoster();
    }
    _this.onCloseShare();
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
    App._get('goods/poster', {
      goods_id: _this.data.goods_id
    }, (result) => {
      _this.setData(result.data, () => {
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
    // 记录formId
    // App.saveFormId(e.detail.formId);
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

  /**
   * 确认购买弹窗
   */
  onToggleTrade(e) {
    let _this = this;
    if (typeof e === 'object') {
      // 记录formId
      e.detail.hasOwnProperty('formId') && App.saveFormId(e.detail.formId);
    }
    _this.setData({
      showBottomPopup: !_this.data.showBottomPopup
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
     * 点击推荐排行
     */
    _onServiceEvent(e) {
      // 拨打电话
      console.log(this.data.rank.params.phone_num);
      wx.navigateTo({
        url: '/'+this.data.rank.params.phone_num,
      })
    },
  /**
   * 返回上一页
   */
  goBack(){
    wx.navigateBack();
  },
  /**
   * 返回首页
   */
  onBackHome(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  }

})