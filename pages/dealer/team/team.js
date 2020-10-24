const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: true,
    dataType: 1,
    page: 1,
    no_more: false,
    grade_id: 0,
    gradeList:'',
    index: '',
    searchValue: '',
    memberList: [],
    total: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //获取等级列表
    this.getGradeList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 获取我的团队列表
    this.getTeamList();
  },
  /**
   *  获取等级列表
   */
  getGradeList(){
    let _this = this;
    App._get('user.dealer.team/gradeList', {
    }, function(result) {
      // 创建页面数据
      _this.setData({
        gradeList: result.data.list
      })
    });
  },
  /**
   * 选择等级
   */
  bindPickerChange(e){
    let _this = this;
    this.setData({
      index: e.detail.value,
      grade_id: _this.data.gradeList[e.detail.value].grade_id,
      list: {},
      page: 1,
      no_more: false,
      isLoading: true,
    },function(){
      _this.getTeamList();
    })
  },
  /**
   * 获取搜索内容
   */
  getSearchContent: function(e) {
    this.setData({
      searchValue : e.detail.value
    })
    // this.getTeamList();
  },
  /**
   * 搜索提交
   */
  search: function() {
    // this.data.searchValue = e.detail.value;
    this.getTeamList();
  },

  /**
   * 获取我的团队列表
   */
  getTeamList: function( isNextPage,page) {

    let _this = this;

    App._get('user.dealer.team/memberList', {
      grade_id: _this.data.grade_id,
      page: page || 1,
      size: 6,
      keywords: _this.data.searchValue || 0
    }, function(result) {

      _this.setData({
        total:result.data.total,
      })
      _this.setData(_this.createData(result.data, isNextPage));
        // 创建页面数据
        // _this.createData(result.data);
      
    });
  },

  /**
   * 创建页面数据
   */
  createData: function(data, isNextPage) {
    let _this = this;
    data['isLoading'] = false;
    // 列表数据
    let dataList = _this.data.data;
    if (isNextPage == true && (typeof dataList !== 'undefined')) {
      data.data = dataList.concat(data.data)
    }
    _this.setData({has_more: false});
    

    // 设置当前页面标题
    // wx.setNavigationBarTitle({
    //   title: data.words.team.title.value
    // });
    // 团队总人数
    // data['team_total'] = data.dealer.first_num;
    // 导航栏数据
    // data['tabList'] = [{
    //   value: 1,
    //   text: data.words.team.words.first.value,
    //   total: data.dealer.first_num
    // }];
    // if (data.setting.level >= 2) {
    //   data['tabList'].push({
    //     value: 2,
    //     text: data.words.team.words.second.value,
    //     total: data.dealer.second_num
    //   });
    //   data['team_total'] += data.dealer.second_num;
    // }
    // if (data.setting.level == 3) {
    //   data['tabList'].push({
    //     value: 3,
    //     text: data.words.team.words.third.value,
    //     total: data.dealer.third_num
    //   });
    //   data['team_total'] += data.dealer.third_num;
    // }
    // 设置swiper的高度
    // this.setSwiperHeight(data.setting.level > 1);
    this.setSwiperHeight(true);
    return data;
  },


  /**
   *  点击加载更多
   */
  moreMemberList(){
    if(this.data.has_more == false){
      this.setData({
        no_more: true
      });
      return false;
    }
    this.getTeamList(++this.data.page);
  },
  /**
   * 下拉到底加载数据
   */
  triggerDownLoad: function() {
    console.log(this.data);
    // 已经是最后一页
    if (this.data.page >= this.data.last_page) {
      this.setData({
        no_more: true
      });
      return false;
    }
    this.getTeamList(true, ++this.data.page);
  },

  /**
   * 设置swiper的高度
   */
  setSwiperHeight: function(isTap) {
    // 获取系统信息(拿到屏幕宽度)
    let systemInfo = wx.getSystemInfoSync(),
      rpx = systemInfo.windowWidth / 750, // 计算rpx
      tapHeight = isTap ? Math.floor(rpx * 86) : 0, // tap高度
      peopleHeight = Math.floor(rpx * 65), // people高度
      swiperHeight = systemInfo.windowHeight - tapHeight - peopleHeight; // swiper高度
    this.setData({
      swiperHeight
    });
  },

  /** 
   * 点击tab切换 
   */
  swichNav: function(e) {
    let _this = this;
    _this.setData({
      dataType: e.target.dataset.current,
      list: {},
      page: 1,
      no_more: false,
      isLoading: true,
    }, function() {
      // 获取我的团队列表
      _this.getTeamList();
    });
  },

})