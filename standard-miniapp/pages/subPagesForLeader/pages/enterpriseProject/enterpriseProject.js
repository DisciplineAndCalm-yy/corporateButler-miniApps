// pages/subPagesForLeader/pages/enterpriseProject/enterpriseProject.js
import { fetch, formatTime } from '../../../../utils/util.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
    toDay: '',
    startDate: '',
    endDate: '',
    enterpriseList: [],
    peopleList: [],
    pageNo: 1,
    pageSize: 10,
    nomore: true,
    // 弹窗
    visible: false,
  },

  // 开始时间
  bindStartDateChange(e) {
    if(this.data.endDate != '' && this.data.endDate < e.detail.value) {
      wx.showToast({
        title: '开始时间不可以大于结束时间',
        icon: 'none',
        duration: 2000
      });
      return
    };
    this.setData({
      startDate: e.detail.value
    }, () => this.getEnterpriseData());
  },
  
  // 结束时间
  bindEndDateChange(e) {
    if(this.data.startDate != '' && this.data.startDate > e.detail.value) {
      wx.showToast({
        title: '结束时间不可以小于开始时间',
        icon: 'none',
        duration: 2000
      });
      return
    };
    this.setData({
      endDate: e.detail.value
    }, () => this.getEnterpriseData());
  },

  // 获取数据
  getEnterpriseData() {
    wx.showLoading({
      title: '加载中',
    });
    const params = {
      startTime: this.data.startDate,
      endTime: this.data.endDate,
      // pageNo: this.data.pageNo,
      // pageSize: this.data.pageSize
    };
    fetch.get('/wx/project/projectStatics/listEnterProjectStaticsVxVo', params, { 'content-type': 'application/x-www-form-urlencoded' }).then(res => {
      if(res.code == 200) {
        this.setData({
          enterpriseList: res.result
          // enterpriseList: this.data.pageNo > 1 ? this.data.enterpriseList.concat(res.result.enterprises) : res.result.enterprises,
          // nomore: res.result.current >= res.result.pages ? true : false
        }, () => {
          wx.hideLoading();
        });
      };
    });
  },

  toShowMoreMan(e) {
    const peopleList = e.currentTarget.dataset.list;
    this.setData({
      visible: true,
      peopleList
    });
  },

  onvisibleChange(e) {
    this.setData({
      visible: e.detail.visible
    });
  },

  // 关闭弹窗
  closePopup() {
    this.setData({
      visible: false
    });
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const toDay = formatTime(new Date(), '-', true);
    const date = new Date();
    const year = date.getFullYear();
    const firstDay = `${year}-01-01`;
    this.setData({
      toDay,
      startDate: firstDay,
      endDate: toDay
    });
    this.getEnterpriseData();
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