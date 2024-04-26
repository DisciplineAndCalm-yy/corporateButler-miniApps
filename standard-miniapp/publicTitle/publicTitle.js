// publicTitle/publicTitle.js
// 获取应用实例
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true
  },
  properties: {
    title: String,
    titleClass: String,
    prevPage: String,
    showback: {
      type: Boolean,
      value: false
    },
    isMatch: {
      type: Boolean,
      value: undefined
    },
    isShare: {
      type: Boolean,
      value: undefined
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    backlast() {
      const isShare = this.properties.isShare ? this.properties.isShare : false;
      if(isShare) {
        wx.switchTab({
          url: '/pages/home/home'
        });
      } else {
        app.globalData.isMatch = this.properties.isMatch ? this.properties.isMatch : false;
        //返回上一个页面
        wx.navigateBack();
      }
    }
  },
  options: {
    addGlobalClass: true
  }
})
