const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 当前页面参数
    options: {},
    isData: false,

    words: {},
    payment: 20,

    bank_default: null, //默认银行卡
    exist_bank: false,  //是否存在银行卡
    bank_id:'',
    bank_info: '',
    choose_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 获取代理提现信息
    this.getDealerWithdraw();
    //获取银行卡列表
    this.getBankList();
  },

  /**
   * 获取代理提现信息
   */
  getDealerWithdraw: function() {
    let _this = this;
    App._get('user.dealer/withdraw', {}, function(result) {
      let data = result.data;
      data.isData = true;
      // 设置当前页面标题
      wx.setNavigationBarTitle({
        title: data.words.withdraw_apply.title.value
      });
      //  默认提现方式
      if(_this.data.choose_id == ''){
        data['payment'] = data.settlement.pay_type[0];
      }else{
        //选择银行卡默认为银行卡
        data['payment'] = data.settlement.pay_type[1];
      }
      _this.setData(data);
    });
  },
  /**
   * 获取银行卡列表
   */
  getBankList(){
    let _this = this;
    App._get('user.bank_card/lists', {}, function(result) {
      let data = result.data;
      if(data.list.length > 0){
        //是否存在默认
        if(data.default_id ){
          data.list.forEach(function(item,index){
            if(data.default_id == item.card_id){
              _this.setData({
                bank_info: item,
                bank_id: item.card_id,
                exist_bank: true
              })
            }
          })
        }else{
          //不存在默认且有银行卡
          _this.setData({
            exist_bank: true
          })
        }

      }


    });
  },
  /**
   * 提交申请 
   */
  formSubmit: function(e) {
    let _this = this,
      values = e.detail.value,
      words = _this.data.words.withdraw_apply.words;


    // 验证可提现佣金
    if (_this.data.dealer.money <= 0) {
      App.showError('当前没有' + words.capital.value);
      return false;
    }
    // 验证提现金额
    if (!values.money || values.money.length < 1) {
      App.showError('请填写' + words.money.value);
      return false;
    }
    // 按钮禁用
    _this.setData({
      disabled: true
    });
    // 提现方式
    values['pay_type'] = _this.data.payment;
    // 数据提交

    wx.showLoading({
      title: '提交中...',
    });

    App._post_form('user.dealer.withdraw/submit', {
      money: values.money,
      pay_type: values.pay_type,
      card_id: _this.data.bank_id
    }, function(result) {
      wx.hideLoading();
      console.log(result);
      // 提交成功
      App.showError(result.msg, function() {
        wx.navigateTo({
          url: '../list/list',
        })
      });
    }, null, function() {
      // 解除按钮禁用
      _this.setData({
        disabled: false
      });
    });
  },

  /**
   * 切换提现方式
   */
  toggleChecked: function(e) {
    this.setData({
      payment: e.currentTarget.dataset.payment
    });
  },

  /**
   * 选择银行卡
   */
  onSelectBank() {
    wx.navigateTo({
      url: '../../bank/' + (this.data.exist_bank ? 'index?from=apply' : 'create')
    });
  },

})