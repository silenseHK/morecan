const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: true,
    sec_isLoading: true,
    dataType: 1,
    page: 1,
    secPage: 1,
    no_more: false,
    sec_no_more: false,
    grade_id: 0,
    gradeList:'',
    index: '',
    searchValue: '',
    memberList: [],
    secTeamList: [],
    total: '',
    popupHeight: '',
    showBottomPopup: false,
    sec_user_id: '',
    secNickNameTeam: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //获取等级列表
    this.getGradeList();
    this.setPoppupHeight(true);
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
      data: '',
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

    App._get('user.dealer.team/normalTeamList', {
      grade_id: _this.data.grade_id,
      page: page || 1,
      size: 15,
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
    if (data.last_page >= data.current_page == true && (typeof dataList !== 'undefined')) {
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
    // 已经是最后一页
    if (this.data.page >= this.data.last_page) {
      this.setData({
        no_more: true
      });
      return false;
    }
    this.getTeamList(true, ++this.data.page);
  },
  secTriggerDownLoad:function(){
    let _this = this;
    // 已经是最后一页
    // if (_this.data.secPage >= _this.data.last_page) {
    //   this.setData({
    //     sec_no_more: true
    //   });
    //   return false;
    // }
    _this.getSecTeamList(true, ++_this.data.secPage);
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

  setPoppupHeight:function(){
    let systemInfo = wx.getSystemInfoSync(),
      rpx = systemInfo.windowWidth / 750, // 计算rpx
      peopleHeight = Math.floor(rpx * 165), // people高度
      popupHeight = systemInfo.windowHeight - peopleHeight; // swiper高度
    this.setData({
      popupHeight
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
  /**
   * 点击加载二级
   */
  onToggleTrade(e) {
    let _this = this;
    _this.setData({
      showBottomPopup: !_this.data.showBottomPopup
    });
  },

  showSecTeam(e){
    this.setData({
      secTeamList: [],
      secPage: 1,
      secNickNameTeam: e.currentTarget.dataset.name,
      sec_user_id: e.currentTarget.dataset.id,
      sec_has_more: false
    })
    this.getSecTeamList();
    this.setData({
      showBottomPopup: !this.data.showBottomPopup
    });
  },
  getSecTeamList: function(id) {
    let _this = this;

    App._get('user.dealer.team/normalTeamList', {
      grade_id: 0,
      page: _this.data.secPage,
      size: 15,
      keywords: _this.data.searchValue || 0,
      user_id: _this.data.sec_user_id
    }, function(result) {


      let resList = result.data.data,
        dataList = _this.data.secTeamList;
      if (result.data.last_page >= result.data.current_page && (typeof resList !== 'undefined')) {
        dataList = dataList.concat(resList);
      }
      if(resList.length == 0){
        _this.setData({sec_has_more: true});
      }

      
      
      // _this.setData(_this.createData(result.data));
      _this.setData({
        sec_isLoading: false,
        secTeamList: dataList
      })
      
    });
  },
  // creatSecTeam(data){
  //   let _this = this;
  //   data['isLoading'] = false;
  //   // 列表数据
  //   let dataList = _this.data.data;
  //   if (data.last_page >= data.current_page == true && (typeof dataList !== 'undefined')) {
  //     data.data = dataList.concat(data.data)
  //   }
  //   _this.setData({has_more: false});
  //   console.log(data);
  //   return data;
  // }

})