// pages/subPagesForLeader/pages/detailIOther/detailIOther.js
import { fetch, formatTime } from '../../../../utils/util.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
    type: 0,
    projectId: '',
    activeTitle: '中央预算项目',
    projectInfo: {}
  },

  // 获取中央预算项目数据
  getCenterData() {
    wx.showLoading({
      title: '加载中',
    });
    const params = {
      id: this.data.projectId
    };
    fetch.get('/project/projectCentreBudget/getById', params, { 'content-type': 'application/x-www-form-urlencoded' }).then(res => {
      if(res.code == 200) {
        this.setData({
          projectInfo: res.result
        }, () => {
          wx.hideLoading();
        });
      };
    });
  },

  // 获取专项债类项目数据
  getSpecialData() {
    wx.showLoading({
      title: '加载中',
    });
    const params = {
      id: this.data.projectId
    };
    fetch.get('/project/projectSpecialPurpose/getById', params, { 'content-type': 'application/x-www-form-urlencoded' }).then(res => {
      if(res.code == 200) {
        this.setData({
          projectInfo: res.result
        }, () => {
          wx.hideLoading();
        });
      };
    });
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const activeTitle = options.menuIndex == 3 ? '专项债类项目' : '中央预算类项目'
    this.setData({
      type: options.menuIndex || 0,
      activeTitle,
      projectId: options.id || ''
    });
    if(options && options.menuIndex == 2) this.getCenterData();
    if(options && options.menuIndex == 3) this.getSpecialData();
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