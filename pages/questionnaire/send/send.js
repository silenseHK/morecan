const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    dataJson:[
      {
        name: '男票',
        bgColor: '#d0e8f8',
        width: '48%',
        height: '138',
        fontsize: 40
      },
      {
        name:  '女票',
        bgColor: '#ecada2',
        width: '48%',
        height: '138',
        fontsize: 40
      },
      {
        name: '孩子妈',
        bgColor: '#ebccca',
        width: '44%',
        height: '118',
        fontsize: 36
      },
      {
        name: '孩子爸',
        bgColor: '#eac999',
        width: '52%',
        height: '118',
        fontsize: 36
      },
      {
        name: '老公',
        bgColor: '#fceec5',
        width: '30%',
        height: '86'
      },
      {
        name: '老婆',
        bgColor: '#ebccca',
        width: '30%',
        height: '86'
      },
      {
        name: '爸爸',
        bgColor: '#ede4f1',
        width: '32%',
        height: '86'
      },
      {
        name: '妈妈',
        bgColor: '#dcb2b3',
        width: '30%',
        height: '72'
      },
      {
        name: '朋友',
        bgColor: '#e3f2fc',
        width: '32%',
        height: '72'
      },
      {
        name: '家人',
        bgColor: '#e2eceb',
        width: '30%',
        height: '72'
      },
      {
        name: '长辈',
        bgColor: '#e0ebc7',
        width: '48%',
      },
      {
        name: '老板',
        bgColor: '#dcd0e3',
        width: '22%',
      },
      {
        name: '客户',
        bgColor: '#f0f09c',
        width: '22%'
      },
      {
        name: '同事',
        bgColor: '#c3d1e9',
        width: '30%'
      },
      {
        name: '···',
        bgColor: '#fff',
        width: '66%'
      },


    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _this = this;
    _this.setData({
      isLogin: App.checkIsLogin()
    });

  },
  selectName(e){
    if(this.data.isLogin){
      let personName = e.currentTarget.dataset.name,
      itemIndex = e.currentTarget.dataset.index;
      if(itemIndex == this.data.dataJson.length-1){
        console.log("其他");
        personName = '';
      }
      wx.navigateTo({
        url: './call?name='+personName,
      })
    }else{
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let _this = this;
    return {
      title: _this.data.title,
      path: "/pages/home/index?" + App.getShareUrlParams()
    };
  }
})