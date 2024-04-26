// pages/subPagesForLeader/pages/mineLeader/mineLeader.js
import { fetch } from '../../../../utils/util.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
    userInfo: {}
  },

  // 企业关联项目报表分析
  toEnterpriseTable() {
    wx.navigateTo({
      url: '/pages/subPagesForLeader/pages/enterpriseProject/enterpriseProject',
    });
  },

  // 项目督办
  toSuperviseProject() {
    wx.navigateTo({
      url: '/pages/subPagesForLeader/pages/superviseProject/superviseProject',
    });
  },

  // 账号管理
  toMyAccont() {
    wx.navigateTo({
      url: '/pages/subPagesForLeader/pages/publicAccont/publicAccont',
    });
  },

  // 退出登录
  toLoginOut() {
    wx.showToast({
      title: '退出成功！',
      icon: 'none'
    });
    setTimeout(() => {
      wx.reLaunch({
        url: '/pages/index/index'
      });
    }, 1000);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let userinfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userinfo
    });
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