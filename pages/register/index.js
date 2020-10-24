const App = getApp();
// 工具类
const util = require('../../utils/util.js');
const Dialog = require('../../components/dialog/dialog');
const  phoneRexp = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[0123456789])\d{8}$/;

Page({
  data: {
    btnTxt: '获取验证码',
    isGetCode: false,
    Loading: false,
    countDown: 60,
    token: '',
    user_id: '',
    invitation_code: '',
    formData: {
      mobile: '',
      verify_code: '',
    }
  },
  onLoad:function(option){
    var _this = this;
    _this.setData({
      token: option.token,
      user_id: option.user_id,
      invitation_code: option.invitation_code
    })
    // wx.getStorage({//获取本地缓存
    //   key:"token",
    //   success:function(res){
    //     _this.setData({
    //       token: res.data
    //     });
    //   },
    // });
  },
  formSubmit(e) {
    // 执行验证
    let _this = this,
    formData = e.detail.value,
        errMsg = '';
    wx.showLoading({
      title: "正在验证",
      mask: true
    });
    if (!formData.phone){
      errMsg = '手机号不能为空';
    }
    if (!formData.code){
      errMsg = '验证码不能为空';
    }
    if (formData.phone){
      if (!phoneRexp.test(formData.phone)) {
        errMsg = '手机号格式不正确';
      }
    }
    if (errMsg){
      wx.hideLoading();
      // App.showError(errMsg);
      wx.showToast({
        title: errMsg,
        icon: 'none'
      })
      return false
    }
    //连接服务器进行验证码手机号验证操作
    App._post_form_bindPhone('user/bindMobile', {
      token: _this.data.token,
      mobile: _this.data.formData.phone,
      verify_code: _this.data.formData.code
    }, function(result) {
      wx.setStorageSync('token', _this.data.token);
      wx.setStorageSync('user_id', _this.data.user_id);
      wx.setStorageSync('invitation_code', result.data.invitation_code);
      wx.showToast({
        title: '手机号绑定成功',
      })
      // 跳转回原页面
      _this.navigateBack();
    }, false, function() {
      wx.hideLoading();
    });
  },
  getPhoneCode() {
    let that = this,
        formData = that.data.formData,
        errMsg = '' ;
        errMsg = !formData.phone ? '手机号不能为空' :
        formData.phone && !phoneRexp.test(formData.phone) ? '手机号格式有误' :
        '' ;
    if (errMsg){
      wx.showToast({
        title: errMsg,
        icon: 'none'
      })
      return false
    }
    wx.showLoading({
      title: '验证中',
    })
     //连接服务器进行获取验证码操作
     App._post_form('user/sendVerifyCode', {
      mobile: that.data.formData.phone,
      code_type: 10
    }, function(result) {
   
      if(result.code ==1){
        wx.showToast({
          title: '短信发送成功',
        });
        that.setData({
          isGetCode: true
        })
        that.timer();
      }else{
        wx.showToast({
          title: result.msg,
          icon: 'none'
        })
      }
      wx.hideLoading();
 
    }, false, function() {
      
    });
  },
  timer() {//验证码倒计时
    let that = this,
      countDown = that.data.countDown;
    let clock = setInterval(() => {
      countDown--
      if (countDown >= 0) {
        that.setData({
          countDown: countDown
        })
      } else {
        clearInterval(clock)
        that.setData({
          countDown: 60,
          isGetCode: false,
          btnTxt: '重新获取'
        })
      }
    }, 1000)
  },
  Input(e) {//输入检索
    let _this = this,
        formData = _this.data.formData,
        inputType = e.currentTarget.dataset.id,
        inputValue = e.detail.value;
    inputType === 'phone' ? 
        formData.phone = inputValue : formData.code = inputValue;
    _this.setData({
      formData
    })

  },
    /**
   * 授权成功 跳转回原页面
   */
  navigateBack: function() {
    // wx.navigateBack();
    // let currentPage = wx.getStorageSync('currentPage');
    // console.log(currentTarget);
    wx.navigateBack({
      // url: '/' + currentPage.route + '?' + util.urlEncode(currentPage.options)
      delta: 2
    });
  }
})