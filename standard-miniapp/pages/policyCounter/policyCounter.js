// pages/policyCounter/policyCounter.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
    counterValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if(typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      });
    };
    const entInfo = wx.getStorageSync('entInfo');
    this.setData({
      counterValue: entInfo ? entInfo.entName : ''
    });
  },

  onInput(e) {
    this.setData({
      counterValue: e.detail.value
    });
  },

  toCounter() {
    // 给全局参数赋值
    app.globalData.isMatch = true;
    wx.navigateTo({
      url: '/pages/subpages/pages/counterPush/counterPush'
    })
    // wx.switchTab({
    //   url: '/pages/accuratePush/accuratePush'
    // })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})