// pages/subPagesForEcharts/pages/publicAccont/publicAccont.js
import { fetch } from '../../../../utils/util.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuHeight: app.globalData.menuHeight,
    menuTop: app.globalData.menuTop,
    userInfo: {}
  },

  // 重置密码
  toResetPwd(e) {
    wx.navigateTo({
      url: '/pages/subPagesForLeader/pages/publicResetPassword/publicResetPassword?id=' + e.currentTarget.dataset.id
    });
  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let userinfo = wx.getStorageSync('userInfo');
    const role = wx.getStorageSync('role');
    if(role == 1) {
      userinfo.roleList = userinfo.roleList.filter(el => el.roleCode == "enterprise_manager");
    };
    if(role == 2) {
      userinfo.roleList = userinfo.roleList.filter(el => el.roleCode == "project_ director");
    };
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