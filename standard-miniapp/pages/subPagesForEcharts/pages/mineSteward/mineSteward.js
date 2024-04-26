// pages/subPagesForEcharts/pages/mineSteward/mineSteward.js
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

  // 我的挂点企业
  toMyEnterprise() {
    wx.navigateTo({
      url: '/pages/subPagesForEcharts/pages/pointEnterprise/pointEnterprise'
    });
  },

  // 挂点企业诉求
  toEnterpriseBeg() {
    wx.navigateTo({
      url: '/pages/subpages/pages/appeal/appeal'
    });
  },

  // 挂点企业项目
  toMyProject() {
    wx.navigateTo({
      url: '/pages/subPagesForEcharts/pages/pointProject/pointProject'
    });
  },

  // 挂点企业打卡
  toMyClock() {
    wx.navigateTo({
      url: '/pages/subPagesForEcharts/pages/clockIn/clockIn',
    })
  },

  // 账号管理
  toMyAccont() {
    wx.navigateTo({
      url: '/pages/subPagesForEcharts/pages/publicAccont/publicAccont',
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
    userinfo.roleList = userinfo.roleList.filter(el => el.roleCode == "enterprise_manager");
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