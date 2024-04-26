// pages/subpages/pages/policyStoreMessage.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
    messageData: [],
    index: 5,
    nomore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getMessageData();
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
        selected: 1
      })
    }
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
    this.setData({
      messageData: [],
      index: 5
    }, ()=> {
      this.getMessageData()
    })
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if(this.data.index > 20) {
      return
    }
    setTimeout(() => {
      this.setData({
        index: this.data.index + 3
      }, () => {
        this.getMessageData();
      })
    }, 300);
  },

  getMessageData() {
    for(let i = 0; i<5; i++) {
      this.data.messageData.push({
        title: '消息提醒',
        content: '这里是您的消息提醒内容，请及时处理及查看这里是您的消息提醒内容，请及时处理及查看。',
        noread: i%2 == 1
      })
      this.setData({
        messageData: this.data.messageData,
        nomore: this.data.messageData.length > 20 ? true : false
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})