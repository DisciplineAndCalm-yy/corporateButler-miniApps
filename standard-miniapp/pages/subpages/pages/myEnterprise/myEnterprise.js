// pages/subpages/pages/myEnterprise/myEnterprise.js
const app = getApp();
const { fetch } = require("../../../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
    entList: [],
    pageNo: 1,
    pageSize: 5,
    nomore: false
  },

  getEnterpriseInfo() {
    fetch.get('/enterprise/entUser/queryEntInfo').then(res => {
      if(res.code == 200) {
        this.setData({
          entInfo: res.result
        });
        wx.setStorageSync('entInfo', res.result);
        wx.hideLoading();
      } else {
        wx.hideLoading();
      };
    });
  },

  getEntList() {
    wx.showLoading({
      title: '加载中',
    });
    const params = {
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize
    };
    fetch.get('/enterprise/entUser/queryPageEntInfo', params).then(res => {
      if(res.result.total == 0) wx.setStorageSync('entInfo', null);
      this.setData({
        entList: this.data.pageNo > 1 ? this.data.entList.concat(res.result.records) : res.result.records,
        nomore: res.result.current >= res.result.pages ? true : false
      }, () => {
        wx.hideLoading();
      });
    });
  },

  toUnbind() {
    wx.navigateTo({
      url: '/pages/subpages/pages/unbindList/unbindList'
    });
  },

  toAddEnt(e) {
    if(e.currentTarget.dataset.iscomplete) {
      wx.navigateTo({
        url: '/pages/subpages/pages/completeEnterprise/completeEnterprise?flag=3&isMine=true&completeTitle=true&isComplete=true&entCode=' + e.currentTarget.dataset.entcode + '&isEdit=true',
      });
    } else {
      wx.navigateTo({
        url: '/pages/subpages/pages/completeEnterprise/completeEnterprise?isMine=true&isComplete=true',
      });
    }
  },

  toDeleteEnt(e) {
    wx.showLoading({
      title: '加载中',
    });
    const currentEntid = wx.getStorageSync('entInfo').id;
    const entId = e.currentTarget.dataset.entid;
    fetch.get('/enterprise/entUser/deleteEnt', { entId: entId }).then(res => {
      if(res.code == 200) {
        wx.showToast({
          title: res.message
        });
        setTimeout(() => {
          if(currentEntid == entId) this.getEnterpriseInfo();
          this.setData({
            entList: [],
            pageNo: 1,
            pageSize: 5
          }, () => {
            wx.hideLoading();
            this.getEntList();
          });
        }, 1000);
      };
    });
  },

  toAddPerson(e) {
    wx.navigateTo({
      url: '/pages/subpages/pages/myentAddPerson/myentAddPerson?entId=' + e.currentTarget.dataset.entid + '&entInfos=' + JSON.stringify(e.currentTarget.dataset.item),
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
    this.setData({
      entList: [],
      pageNo: 1,
      pageSize: 5
    }, ()=> {
      this.getEntList();
    });
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
      this.getEntList();
    })
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
      this.getEntList();
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
  }
})