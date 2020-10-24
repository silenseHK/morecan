const App = getApp();
// 对话框插件
import Dialog from '../../components/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    userInfo: {}, // 用户信息
    orderCount: {}, // 订单数量
    couponCount: {}, // 优惠券数量
    agent:{},
    grade_process: '',
    isIPX: App.globalData.isIPX,  // 将全局参数值赋予当前页面
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
    let _this = this;
    _this.setData({
      isLogin: App.checkIsLogin()
    });

    /**
     * 获取我的服务导航
     */
    _this.navServerList();

    // 获取当前用户信息
    _this.getUserDetail();
    
    if(_this.data.isLogin){
      //获取代理用户信息
      _this.getAgentDetail();
    }

  },

  navServerList(){
    let _this = this;
    App._get('page/index', {
      page_id: '10006'
    }, function(result) {
      // 设置顶部导航栏栏
      // _this.setPageBar(result.data.page);
      _this.setData(result.data);
      // 回调函数
      typeof callback === 'function' && callback();
    });
  },

  /**
   * 获取当前用户信息
   */
  getUserDetail() {
    let _this = this;
    App._get('user.index/detail', {}, function(result) {
      _this.setData(result.data);
    });
  },
  getAgentDetail(){
    let _this = this;
    App._get('user.agent/index', {}, function(result) {
      let grade_process = (result.data.grade.next.current/result.data.grade.next.target).toFixed(2);
      _this.setData({
        agent:result.data,
        grade_process: grade_process*100
      });
    });
  },
  /**
   * 给推荐人打电话
  */
  phoneCall(e){
    let phone = e.currentTarget.dataset.phone;
    if(e.currentTarget.dataset.phone){
      wx.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.phone,
      })
    }else{
      App.showError('未找到手机号');
    }
   
  },
   /**
   * 订单导航跳转
   */
  onTargetOrder(e) {
    let _this = this;
    if (!_this.onCheckLogin()) {
      return false;
    }
    // 记录formid
    App.saveFormId(e.detail.formId);
    // 转跳指定的页面
    getApp().globalData.orderType = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '/pages/order/index'
    })
  },

  /**
   * 菜单列表导航跳转
   */
  onTargetMenus(e) {
    let _this = this;
    if (!_this.onCheckLogin()) {
      return false;
    }
    // 记录formId
    App.saveFormId(e.detail.formId);
    wx.navigateTo({
      url: '/' + e.currentTarget.dataset.url
    })
  },

  /**
   * 跳转我的钱包页面
   */
  onTargetWallet(e) {
    let _this = this;
    if (!_this.onCheckLogin()) {
      return false;
    }
    wx.navigateTo({
      url: '/pages/dealer/wallet/index'
    })
  },

  /**
   * 跳转积分明细页
   */
  onTargetPoints(e) {
    let _this = this;
    if (!_this.onCheckLogin()) {
      return false;
    }
    // 记录formId
    App.saveFormId(e.detail.formId);
    wx.navigateTo({
      url: '/pages/dealer/money/rebate'
    });
  },
  /**
   * 跳转到登录页
   */
  onLogin() {
    wx.navigateTo({
      url: '../login/login',
    });
  },
    /**
   * 验证是否已登录
   */
  onCheckLogin() {
    let _this = this;
    if (!_this.data.isLogin) {
      App.showError('很抱歉，您还没有登录');
      return false;
    }
    return true;
  },
  /**
   * 待入账提醒
   */
  showHelp(e){
    console.log(e);
    Dialog({
      title: `待确认说明`,
      message: '发货提货后，货款及推荐奖先进入待确认金额中，用户确认收货后进入账户余额，如用户不确认收货系统7天会自动确认收货哦~',
      selector: '#zan-base-dialog',
      isScroll: true, // 滚动
      buttons: [{
        text: '了解啦',
        color: '#DCAA81',
        type: 'cash'
      }]
    });
  },

  toMessageIndex(){
    let _this = this;
    let tmplItem = 'BKUWE9eb2uAd2AFt9iuffitK1kMmp8CWKikIlHpsw5I';
    if (tmplItem.length > 0) {
      wx.requestSubscribeMessage({
        tmplIds: [tmplItem],
        success(res) {

        },
        fail(res) {
   
        },
        complete(res) {
          _this.toMessageList();
        },
      });
    }
  },

  /**
   * 跳转消息列表
   */
  toMessageList(){
    wx.navigateTo({
      url: '/pages/message/index',
    })
  },
  /**
   * 退出登录
   */
  quitProgram(){
    wx.showModal({
      title: '温馨提示',
      content: '是否退出小程序',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.clearStorage();
          wx.reLaunch({
            url: '/pages/user/index',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})