// pages/subPagesForEcharts/pages/mineProjectmanager/mineProjectmanager.js
import { fetch } from '../../../../utils/util.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuHeight: app.globalData.menuHeight,
    menuTop: app.globalData.menuTop,
    userInfo: {},
    projectNum: 0
  },

  getProjectNum() {
    wx.showLoading({
      title: '加载中',
    });
    fetch.get('/wx/project/projectInfo/getProjectNum').then(res => {
      if(res.code == 200) {
        this.setData({
          projectNum: res.result
        }, () => {
          wx.hideLoading();
        });
      };
    });
  },

  // 一键直达
  toOneKey() {
    wx.navigateTo({
      url: '/pages/subPagesForEcharts/pages/oneKeyDirect/oneKeyDirect'
    });
  },

  // 我的督办
  toSupervise() {
    wx.navigateTo({
      url: '/pages/subPagesForEcharts/pages/projectSupervise/projectSupervise'
    });
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
    userinfo.roleList = userinfo.roleList.filter(el => el.roleCode == 'project_ director');
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
    this.getProjectNum();
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