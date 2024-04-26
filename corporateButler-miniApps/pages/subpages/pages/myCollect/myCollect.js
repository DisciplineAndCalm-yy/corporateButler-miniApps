// pages/subpages/pages/myCollect/myCollect.js
const app = getApp();
const { fetch } = require("../../../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
    userInfo: {},
    showpopup: '0',
    tagsOption: [],
    policyTitle: '',
    labelIds: '',
    pageNo: 1,
    pageSize: 5,
    nomore: false,
    policyData: [],
    policyCss: {
      '政策层级': 'policy_leave_css',
      '政策类型': 'policy_type_css',
      '产业类型': 'production_type_css',
      '申报类型': 'push_type_css',
      '行业分类': 'industry_info_css',
      '政策对象': 'policy_object_css',
      '政策主题': 'policy_theme_css'
    }
  },

  searchInput(e) {
    this.setData({
      policyData: [],
      pageNo: 1,
      pageSize: 5,
      policyTitle: e.detail.value
    }, () => {
      this.getPolicyData();
    });
  },

  changeShowpopup() {
    this.setData({
      showpopup: true
    })
  },

  handleTagCheck(e) {
    let list = [];
    const itemindex = e.currentTarget.dataset.itemindex;
    list = this.data.tagsOption;
    list[itemindex].checked = e.detail.checked;
    this.setData({ tagsOption: list });
  },

  searchCofirm() {
    let list = this.data.tagsOption.filter(el => el.checked);
    let strs = '';
    list.forEach((el, index) => {
      if(index > 0) {
        strs += ',' + el.dictCode;
      } else {
        strs += el.dictCode;
      };
    });
    this.setData({
      policyData: [],
      pageNo: 1,
      pageSize: 5,
      showpopup: false,
      labelIds: strs
    }, () => {
      this.getPolicyData();
    });
  },

  closePopup() {
    this.setData({
      showpopup: false
    });
  },

  handleClick(e) {
    wx.navigateTo({
      url: '/pages/subpages/pages/policyMatchDetail/policyMatchDetail?policyId=' + e.currentTarget.dataset.id
    });
  },

  getTagsData() {
    wx.showLoading({
      title: '加载中',
    });
    const params = {
      userId: this.data.userInfo.userId
    };
    fetch.get('/policy/mobile/listByCollectLabelId', params).then(res => {
      if(res.code == 200) {
        let list = res.result;
        list.forEach(el => el.checked = false);
        this.setData({
          tagsOption: list
        }, () => {
          wx.hideLoading();
        });
      };
    });
  },

  getPolicyData() {
    wx.showLoading({
      title: '加载中',
    });
    const params = {
      userId: this.data.userInfo.userId,
      labelIds: this.data.labelIds,
      policyTitle: this.data.policyTitle,
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize
    }
    fetch.get('/policy/mobile/listByCollect', params).then(res => {
      if(res.code == 200) {
        this.setData({
          policyData: this.data.pageNo > 1 ? this.data.policyData.concat(res.result.records) : res.result.records,
          nomore: res.result.current >= res.result.pages ? true : false
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
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo,
      policyData: [],
      pageNo: 1,
      pageSize: 5
    });
    this.getTagsData();
    this.getPolicyData();
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
      policyData: [],
      pageNo: 1,
      pageSize: 5
    }, ()=> {
      this.getPolicyData();
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
      this.getPolicyData();
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})