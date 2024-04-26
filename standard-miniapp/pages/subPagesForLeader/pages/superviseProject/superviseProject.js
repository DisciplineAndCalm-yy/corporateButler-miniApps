// pages/subPagesForLeader/pages/superviseProject/superviseProject.js
import { fetch, formatTime } from '../../../../utils/util.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
    superviseList: [],
    superviseProgressMap: {
      '2': '',
      '3': 'supervise_iconcolor_orange',
      '4': 'supervise_iconcolor_red'
    },
    // 督办弹窗
    superviseVisible: false,
    superviseInfo: {},
  },

  // 获取项目督办数据
  getSuperviseData() {
    wx.showLoading({
      title: '加载中',
    });
    fetch.get('/wx/project/projectInfo/remindList').then(res => {
      wx.hideLoading();
      if(res.code == 200) {
        this.setData({ superviseList: res.result });
      };
    });
  },

  // 打开督办弹窗
  openSupervisePopup(e) {
    const pid = e.currentTarget.dataset.pid;
    wx.showLoading({
      title: '加载中',
    });
    fetch.get('/project/projectSupervision/queryByProjectId', { projectId: pid }).then(res => {
      wx.hideLoading();
      if(res.code == 200) {
        this.setData({
          superviseInfo: res.result,
          superviseVisible: true
        });
      };
    });
  },

  onSuperviseVisibleChange(e) {
    this.setData({
      superviseVisible: e.detail.visible
    });
  },

  // 关闭督办弹窗
  closeSupervisePopup() {
    this.setData({
      superviseVisible: false
    });
  },

  // 拨打电话
  toCallPhone(e) {
    const phoneNumber = e.currentTarget.dataset.phonenum;
    wx.makePhoneCall({
      phoneNumber: phoneNumber
    });
  },

  // 发送督办
  toPushSupervise(e) {
    if(e.detail.value.textarea.length > 200) {
      wx.showToast({
        title: '督办内容支持200字之内',
        icon: 'none'
      });
      return
    };
    wx.showLoading({
      title: '加载中',
    });
    const that = this;
    const params = {
      projectId: this.data.superviseInfo.projectId,
      content: e.detail.value.textarea
    };
    fetch.post('/project/projectSupervision/add', params, { 'content-type': 'application/x-www-form-urlencoded' }).then(res => {
      wx.hideLoading();
      if(res.code == 200) {
        wx.showToast({
          title: res.message,
          icon: 'none'
        });
        setTimeout(() => {
          that.setData({
            superviseVisible: false
          });
        }, 1000);
      };
    });
  },
  
  // 查看进展
  toLookProgression(e) {
    wx.navigateTo({
      url: '/pages/subPagesForLeader/pages/projectDetail/projectDetail?id=' + e.currentTarget.dataset.pid + '&isPoint=false'
    });
  },
  
  // 跳转督办记录页面
  toSuperviseRecord() {
    wx.navigateTo({
      url: '/pages/subPagesForLeader/pages/superviseRecord/superviseRecord'
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getSuperviseData();
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