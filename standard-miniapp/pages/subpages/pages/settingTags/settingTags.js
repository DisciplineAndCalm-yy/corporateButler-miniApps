// pages/subpages/pages/settingTags/settingTags.js
const app = getApp();
const { fetch } = require("../../../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
    entInfo: {},
    activetab: '0',
    labelTypeList: [],
    labelTypeMap: {},
    tagsOption: []
  },

  getTagsData() {
    wx.showLoading({
      title: '加载中',
    });
    fetch.get('/enterprise/entLabel/list', { entId: this.data.entInfo.id }).then(res => {
      let list = [];
      let obj = {};
      if(res.code == 200) {
        res.result.forEach((item, index) => {
          list.push(item);
          obj[index] = item.children;
        });
        this.setData({
          labelTypeList: list,
          labelTypeMap: obj,
          tagsOption: obj[0]
        }, () => {
          wx.hideLoading();
        });
      };
    });
  },

  handleChangeTab(e) {
    this.setData({
      activetab: e.currentTarget.dataset.tabindex,
      tagsOption: this.data.labelTypeMap[e.currentTarget.dataset.tabindex]
    });
  },

  // Tag标签选中事件
  handleTagCheck(e) {
    let list = [];
    const itemindex = e.currentTarget.dataset.itemindex;
    // const itemLabelId = e.currentTarget.dataset.labelid;
    list = this.data.tagsOption;
    list[itemindex].subscribed = e.detail.checked;
    this.setData({ tagsOption: list });
  },

  toSaveTags() {
    wx.showLoading({
      title: '加载中',
    });
    let list = [];
    for(let val of Object.values(this.data.labelTypeMap)) {
      val.forEach(el => {
        if(el.subscribed) {
          list.push(el.labelId);
        };
      });
    };
    let params = {
      entId: this.data.entInfo.id,
      policyLabelList: list
    };
    fetch.post('/enterprise/entLabel/subscribe', params).then(res => {
      if(res.code == 200) {
        wx.showToast({
          title: res.message
        });
        setTimeout(() => {
          this.setData({
            activetab: 0
          }, () => {
            wx.hideLoading();
            wx.navigateBack();
          });
        }, 1000);
      };
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
      entInfo: wx.getStorageSync('entInfo') || {}
    }, () => {
      this.getTagsData();
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