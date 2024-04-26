// pages/subPagesForEcharts/pages/pointEnterprise/pointEnterprise.js
import { fetch } from '../../../../utils/util.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
    userInfo: {},
    entList: [],
    pageSize: 5,
    pageNo: 1,
    nomore: false,
  },

  getEntData() {
    wx.showLoading({
      title: '加载中',
    });
    const params = {
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize
    };
    fetch.get('/enterprise/entManger/manger/entList', params).then(res => {
      this.setData({
        entList: this.data.pageNo > 1 ? this.data.entList.concat(res.result.records) : res.result.records,
        nomore: res.result.current >= res.result.pages ? true : false
      }, () => {
        wx.hideLoading();
      });
    });
  },

  toShowEntProject(e) {
    wx.navigateTo({
      url: '/pages/subPagesForEcharts/pages/entAndPersonInfo/entAndPersonInfo?entCode=' + e.currentTarget.dataset.entcode + '&entId=' + e.currentTarget.dataset.id
    });
  },

  toShowEntBeg(e) {
    wx.navigateTo({
      url: '/pages/subpages/pages/appeal/appeal?entId=' + e.currentTarget.dataset.id
    });
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
    this.getEntData();
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
      entList: [],
      pageNo: 1,
      pageSize: 5
    }, ()=> {
      this.getEntData();
    });
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if(this.data.nomore) return
    this.setData({
      pageNo: this.data.pageNo + 1
    }, () => {
      this.getEntData();
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})