const App = getApp();

Component({

  options: {

  },

  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    itemIndex: String,
    itemStyle: Object,
    params: Object,
    dataList: Object,
    show: {
      type: Boolean,
      value: true
    },
    // 是否有遮罩层
    overlay: {
      type: Boolean,
      value: true
    },
    // 遮罩层是否会显示
    showOverlay: {
      type: Boolean,
      value: true
    },
    // 内容从哪个方向出，可选 center top bottom left right
    type: {
      type: String,
      value: 'center'
    }
  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {

    /**
     * 跳转到指定页面
     */
    navigationTo: function(e) {
      App.navigationTo(e.currentTarget.dataset.url);
    },

    handleMaskClick: function handleMaskClick() {
      // this.triggerEvent('clickmask', {});
      this.setData({show:false});
    }

  }
})