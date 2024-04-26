// pages/subPagesForEcharts/pages/projectProgress/projectProgress.js
import { fetch } from '../../../../utils/util.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuHeight: app.globalData.menuHeight,
    menuTop: app.globalData.menuTop,
    projectId: null,
    projectInfo: {},
    projectList: [],
    nomore: true
  },

  // 获取项目信息
  getProjectInfo() {
    wx.showLoading({
      title: '加载中',
    });
    const params = {
      id: this.data.projectId
    };
    fetch.get('/wx/project/projectInfo/getById', params).then(res => {
      this.setData({
        projectInfo: res.result
      }, () => {
        wx.hideToast();
        wx.hideLoading();
      });
    });
  },

  // 获取数据
  getData() {
    wx.showLoading({
      title: '加载中',
    });
    const params = {
      projectId: this.data.projectId
    };
    fetch.get('/project/projectStage/wxList', params).then(res => {
      if(res.code == 200) {
        this.setData({
          projectList: res.result
        }, () => {
          wx.hideLoading();
        });
      };
    });
  },

  // 查看更多督办
  toShowSupervise(e) {
    const list = e.currentTarget.dataset.list;
    const pid = e.currentTarget.dataset.pid;
    wx.navigateTo({
      url: '/pages/subPagesForEcharts/pages/projectSuperviseDetail/projectSuperviseDetail?id=' + pid + '&list=' + list
    });
  },

  // 设置完成
  toComplate(e) {
    wx.showLoading({
      title: '加载中',
    });
    const params = {
      id: e.currentTarget.dataset.id
    };
    fetch.get('/project/projectStage/setCompletion', params).then(res => {
      if(res.code == 200) {
        wx.hideLoading();
        wx.showToast({
          title: '设置成功！',
          icon: 'none',
          duration: 2000
        });
        setTimeout(() => {
          this.getData();
        }, 1500);
      };
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      projectId: options.id ? options.id : null
    }, () => {
      this.getData();
      this.getProjectInfo();
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