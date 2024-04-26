// pages/subpages/pages/question/question.js
const app = getApp(); //  获取小程序实例
Page({
  /**
   * 页面的初始数据
   */
  data: {
    menuTop: app.globalData.menuTop,  //  获取小程序顶部距离，适配各种手机型号对齐右上角胶囊导航栏
    menuHeight: app.globalData.menuHeight,  //  获取小程序胶囊高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  },
  // 继续反馈
  onFeedback () {
    console.log('asddasads');
    wx.navigateTo({
      url: '/pages/subpages/pages/questionQrcode/questionQrcode',
    })
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