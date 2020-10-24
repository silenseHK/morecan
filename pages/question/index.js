const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    categoryList: [],
    keywords: '',
    cate_id: 0, // 当前的分类id (0则代表首页)
    type: 0, // 列表类型  0.全部；10.待发货；20.待收货；30.已完成
    list: [], // 订单列表
    scrollHeight: null, // 列表容器高度
    
    has_more: true,
    no_more: false, // 没有更多数据
    isLoading: true, // 是否正在加载中

    page: 1, // 当前页码


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this;
    // 获取问题分类
    _this.getCateList();
    // 获取消息列表
    _this.getQuestionList();
    // 设置scroll-view高度
    _this.setListHeight();
    // 设置数据类型
    _this.setData({
      type: options.type || 0
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
  
  },

  // 获取问题分类
  getCateList(){
    let _this = this;
    App._get('online_questions/cateList', {

    }, result => {
      _this.setData({
        categoryList: result.data.list
      })
    })
  },

   /**
   * 获取搜索内容
   */
  getSearchContent: function(e) {
    this.setData({
      keywords : e.detail.value
    })
  },

  /**
   * 搜索提交
   */
  search: function() {
    this.setData({
      list: {},
      page: 1,
      no_more: false,
      isLoading: true
    })
    this.getQuestionList();
  },

  /**
   * Api：切换导航栏
   */
  onSwitchTab: function(e) {
    let _this = this;
    // 第一步：切换当前的分类id
    _this.setData({
      cate_id: e.currentTarget.dataset.id,
      list: {},
      page: 1,
      no_more: false,
      isLoading: true,
    });
    // 第二步：更新当前的文章列表
    _this.getQuestionList();
  },

  /**
   * 获取消息列表
   */
  getQuestionList(isPage, page) {
    let _this = this;
    App._get('online_questions/answerList', {
      page: page || 1,
      keywords: _this.data.keywords,
      cate_id: _this.data.cate_id,
      size: 6
    }, result => {
      //如果为空不加载
      if(result.data.list.length <= 0){
        _this.setData({
          no_more: true,
          isLoading: false,
          has_more: false
        })
        return false;
      }
      let resList = result.data.list,
        dataList = _this.data.list;
      if (isPage == true) {
        _this.setData({
          'list': dataList.concat(resList),
          isLoading: false,
          has_more: true
        });
      } else {
        _this.setData({
          list: resList,
          isLoading: false,
          has_more: true
        });
      }
    });
  },

  /**
   * 跳转订单详情页
   */
  onTargetDetail(e) {
    let question_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './detail?question_id=' + question_id
    });
  },

  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },

  /**
   * 下拉到底加载数据
   */
  bindDownLoad() {
    // 已经是最后一页
    let _this = this;
    if (_this.data.no_more == true) {
      _this.setData({
        has_more: true
      });
      return false;
    }else{
      // 加载下一页列表
      _this.getQuestionList(true, ++this.data.page);
    }
  },

  /**
   * 设置问题列表高度
   */
  setListHeight() {
    let systemInfo = wx.getSystemInfoSync(),
      rpx = systemInfo.windowWidth / 750, // 计算rpx
      tapHeight = Math.floor(rpx * 168), // tap高度
      scrollHeight = systemInfo.windowHeight - tapHeight; // swiper高度
    console.log(
      systemInfo.windowHeight
    );
    this.setData({
      scrollHeight
    });
  },

});