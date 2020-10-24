const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: true,
    fill_id: '',
    bmi: '',
    fill_id: '',
    food_list: [],
    bmi: '',
    bmi_advice: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({fill_id: options.fill_id})
    this.getRecipes()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  /**
   * 获取食谱方案
   */
  getRecipes(){
    let _this = this;
    wx.showLoading({
      title: '加载中...',
    })
    App._get('questionnaire/reportDetail', {
      fill_id: _this.data.fill_id
    }, function(result) {
       wx.hideLoading();
      let resData = result.data.info,
        foodList = resData.food_group.images;
       // 设置页面标题
       wx.setNavigationBarTitle({
        title: resData.username+"的食谱"
      })
      _this.setData({
        food_list: foodList,
        icon_list: resData.goals,
        username: resData.username,
        sex: resData.sex,
        sex_bg: resData.bg_img,
        fill_id: resData.fill_id,
        bmi:resData.bmi,
        bmi_advice: resData.bmi_advice,
        isLoading: false
      })
 
    });
  },

    /**
   * 浏览图片
   */
  onPreviewImages(e) {
    let _this = this;
    let index = e.currentTarget.dataset.index,
      imageUrls = [];
    _this.data.food_list.forEach(item => {
      imageUrls.push(item.file_path);
    });
    wx.previewImage({
      current: imageUrls[index],
      urls: imageUrls
    })
  },

  /**
   * 去购买
   */
  onConfirmSubmit(){
    wx.navigateTo({
      url: '/pages/plan/plan',
    })
  },
 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})