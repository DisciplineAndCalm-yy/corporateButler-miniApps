// pages/subPagesForEcharts/pages/projectSuperviseDetail/projectSuperviseDetail.js
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
    idList: [],
    projectList: []
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

  getData() {
    wx.showLoading({
      title: '加载中',
    });
    const params = {
      idList: this.data.idList
    };
    fetch.post('/project/projectSupervision/selectByIdList', params, { 'content-type': 'application/x-www-form-urlencoded' }).then(res => {
      if(res.code == 200) {
        this.setData({
          projectList: res.result
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
    let idList = [];
    if(options && options.list) {
      idList = options.list.split(',');
    };
    this.setData({
      projectId: options.id ? options.id : null,
      idList
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