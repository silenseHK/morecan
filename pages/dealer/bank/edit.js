let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,

    bankCardList:'',
    bank_id: '',
    is_default: 0,
    index: '',
    card_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.card_id);
    this.setData({
      card_id: options.card_id
    })
    // 获取银行卡数据
    this.getBankDetail(options.card_id);
    //获取银行列表
    this.getBankList();
  },
  /**
   * 获取银行卡列表
   */
  getBankList(){
    let _this = this;
    App._get('user.bank_card/banks', {}, function(result) {
     
      for (var index in result.data.list) {
        if(_this.data.bank_id == result.data.list[index].bank_id){
          //获取下标
          _this.setData({
            index: index
          })
        }
      }
      _this.setData({
        bankCardList: result.data.list
      })
    });
  },
  /**
   * 选择银行卡触发
   */
  bindBankChange(e){
    let _this = this;
    this.setData({
      index: e.detail.value,
      bank_id: _this.data.bankCardList[e.detail.value].bank_id
    })
  },
  /**
   * 设置默认银行卡
   */
  switchChange(e){
    console.log(e);
    if(e.detail.value == true){
      this.setData({
        //设为默认
        is_default: 1
      })
    }else{
      this.setData({
        is_default: 0
      })
    }
  },
  getBankDetail(card_id){
    let _this = this;
    App._get('user.bank_card/detail', {
      card_id
    }, function(result) {
      _this.setData(result.data);
    });
  },
  /**
   * 表单提交
   */
  saveData: function(e) {
    let _this = this,
      values = e.detail.value;
      values.card_id = _this.data.card_id
      values.bank_id = _this.data.bank_id;
      values.is_default = _this.data.is_default;

    // 表单验证
    if (!_this.validation(values)) {
      App.showError(_this.data.error);
      return false;
    }

    // 按钮禁用
    _this.setData({
      disabled: true
    });

    // 提交到后端
    App._post_form('user.bank_card/edit', values, function(result) {
      App.showSuccess(result.msg, function() {
        wx.navigateBack();
      });
    }, false, function() {
      // 解除禁用
      _this.setData({
        disabled: false
      });
    });
  },

  /**
   * 表单验证
   */
  validation: function(values) {
    let error = '';
    if (values.card_account === '') {
      error = '开户人姓名不能为空';
    }
    if (values.card_number === '') {
      error = '银行卡号不能为空';
    }
    if (values.bank_id === '') {
      error = '请选择开户行';
    }
    if (values.bank_address === '') {
      error = '请填写开户行地址';
    }
    if (error){
      App.showError(error);
      return false
    }
    return true;
  }
})