// pages/subPagesForEcharts/pages/projectSupervise/projectSupervise.js
import { fetch } from '../../../../utils/util.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuHeight: app.globalData.menuHeight,
    menuTop: app.globalData.menuTop,
    list: [],
    pageNo: 1,
    pageSize: 10,
    nomore: false
  },

  // 查询数据
  getList() {
    wx.showLoading({
      title: '加载中',
    });
    const params = {
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize
    };
    fetch.get('/project/projectSupervision/queryPageListByProjectLeaderId', params).then(res => {
      this.setData({
        list: this.data.pageNo > 1 ? this.data.list.concat(res.result.records) : res.result.records,
        nomore: res.result.current >= res.result.pages ? true : false
      }, () => {
        wx.hideLoading();
      });
    });
  },

  // 跳转详情
  toShowMore(e) {
    const id = e.currentTarget.dataset.id;
    const pid = e.currentTarget.dataset.pid;
    const list = [];
    list.push(id);
    wx.navigateTo({
      url: '/pages/subPagesForEcharts/pages/projectSuperviseDetail/projectSuperviseDetail?id=' + pid + '&list=' + list
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getList();
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
    this.setData({
      list: [],
      pageNo: 1,
      pageSize: 10
    }, ()=> {
      this.getList();
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
      this.getList();
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})