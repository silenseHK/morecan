const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: true,
    indicatorDots: false, // 是否显示面板指示点
    autoplay: false, // 是否自动切换
    interval: 3000, // 自动切换时间间隔
    duration: 800, // 滑动动画时长
    currentIndex: 0, // 轮播图指针

    swiperHeight: '',
    fill_id: '',
    report_id: '',
    food_list: '',
    icon_list: '',
    sex: '',
    sex_bg: [],
    suggestionId: '',
    backgroundColor: ['#fbf4df','#f1f5dd','#e5ebf2','#e0efed','#f5f8ee','#fbf4df','#f1f5dd','#e5ebf2','#e0efed','#f5f8ee']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      report_id: options.fill_id
    })
    this.setSwiperHeight();

    this.getReportDetail();

    this.getReportItem()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  getReportDetail(){
    let _this = this;
    App._get('questionnaire/healthAdvice', {
      fill_id: _this.data.report_id
    }, function(result) {
      wx.hideLoading({
        complete: (res) => {},
      })
      let resList = result.data.info.advice;
      let arrJson = [];
      for(let i in resList){
        if(resList[i].advice.length> 0 ){
          arrJson.push(resList[i])
        }
      }
      let bmi = parseFloat(result.data.info.bmi).toFixed(2);

      let infoJson ={
        advice:['info']
      }
      arrJson.splice(arrJson,0,infoJson)
      _this.setData({
        bmi: bmi,
        list: arrJson,
        isLoading: false
      })

    })
  },

  /**
   * 获取报告详情
   */
  getReportItem(){
    let _this = this;
    wx.showLoading({
      title: '加载中...',
    })
    App._get('questionnaire/reportDetail', {
      fill_id: _this.data.report_id
    }, function(result) {
       wx.hideLoading();
      let resData = result.data.info,
        painPoint = resData.pain_point_analysis;
       // 设置页面标题
       wx.setNavigationBarTitle({
        title: resData.username+"的报告"
      })
      let dataJson = {
        file_path: "",
      }
      if(painPoint){
      for(let i in painPoint){
        for(let j in _this.data.backgroundColor){
          painPoint[i]['background_bg'] = _this.data.backgroundColor[i];
        }
      }
      painPoint.splice(painPoint,0,dataJson);
    }
      _this.setData({
        food_list: resData.food_group.images,
        pain_point: painPoint,
        icon_list: resData.goals,
        username: resData.username,
        sex: resData.sex,
        sex_bg: resData.bg_img,
        fill_id: resData.fill_id
      })
 
    });
  },

    /**
   * 设置swiper的高度
   */
  setSwiperHeight: function() {
    // 获取系统信息(拿到屏幕宽度)
    let systemInfo = wx.getSystemInfoSync(),
      rpx = systemInfo.windowWidth / 750, // 计算rpx
      // tapHeight = Math.floor(rpx * 82), // tap高度
      swiperHeight = systemInfo.windowHeight; // swiper高度
      console.log(swiperHeight);
    this.setData({
      swiperHeight
    });
  },
    /**
     * 记录当前指针
     */
    _bindChange(e) {
      this.setData({
        currentIndex: e.detail.current
      });
    },
    /**
     * 查看建议详情
     */
    toReportDetail(){
      wx.navigateTo({
        url: './detail?fill_id='+this.data.fill_id,
      })
    },
    /**
     * 查看食谱
     */
    toRecipes(){
      wx.navigateTo({
        url: './recipes?fill_id='+this.data.fill_id,
      })
    },
    onConfirmSubmit(){
      wx.navigateTo({
        url: '/pages/plan/plan?bmi='+this.data.bmi
      })
    },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})