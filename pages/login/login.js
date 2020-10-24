const App = getApp();

// 工具类
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: '',
    encryptedData: '',
    iv: '',
    userInfo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  
  },

  /**
   * 授权登录
   */
  authorLogin: function(e) {
    let _this = this;
    if (e.detail.errMsg !== 'getUserInfo:ok') {
      return false;
    }
    wx.showLoading({
      title: "正在验证登录",
      mask: true
    });
    console.log(e);
    _this.setData({
      userInfo: e.detail.rawData
    })
    // 执行微信登录
    wx.login({
      success: function(res) {
        console.log(res);
        _this.setData({
          code: res.code
        })
                  // 查看是否授权
    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              console.log(res)
        
              _this.setData({
                encryptedData: res.encryptedData,
                iv: res.iv,
                // userInfo: res.userInfo,
                signature: res.signature
              })
              _this.postLogin();
            }
          })
        }
      }
    })
  
      }
    });
  },
  postLogin(){
    let _this = this;
          // 发送用户信息
    App._post_form('user/login', {
            code: _this.data.code,
            // user_info: _this.data.rawData,
            // encrypted_data: e.detail.encryptedData,
            // iv: e.detail.iv,
            encrypted_data: _this.data.encryptedData,
            iv: _this.data.iv,
            signature: _this.data.signature,
            referee_id: wx.getStorageSync('referee_id'),
            user_info: _this.data.userInfo
          }, function(result) {
            let token = result.data.token;
            let user_id = result.data.user_id;
            let invitation_code = result.data.invitation_code;
    
            if(result.data.is_bind_mobile === 0){
              wx.navigateTo({
                //跳转绑定手机号
                url: '/pages/register/index?token='+token+'&user_id='+user_id+'&invitation_code='+invitation_code
              });
            }else{
              // 记录token user_id
              wx.setStorageSync('token', result.data.token);
              wx.setStorageSync('user_id', result.data.user_id);
              wx.setStorageSync('invitation_code', result.data.invitation_code);
              // 跳转回原页面
              _this.navigateBack();
            }
          }, false, function() {
              wx.hideLoading();
          });
  },
  /**
   * 暂不登录
   */
  onNotLogin() {
    let _this = this;
    // 跳转回原页面
    _this.onNavigateBack();
  },
    /**
   * 授权成功 跳转回原页面
   */
  onNavigateBack() {
    wx.navigateBack();
  },

  /**
   * 授权成功 跳转回原页面
   */
  navigateBack: function() {
    wx.navigateBack();
    // let currentPage = wx.getStorageSync('currentPage');
    // wx.redirectTo({
    //   url: '/' + currentPage.route + '?' + util.urlEncode(currentPage.options)
    // });
  }
})