// pages/subPagesForEcharts/pages/publicProjectStore/publicProjectStore.js
import { fetch } from '../../../../utils/util.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
    dropActive: 0,
    pageSize: 5,
    pageNo: 1,
    nomore: false,
    projectSearch: '',
    projectType: {
      value: '',
      options: []
    },
    projectMoney: {
      value: '',
      options: []
    },
    projectArea: {
      value: '',
      options: []
    },
    projectList: [],

    dropActiveMap: {
      '1': 'dropActive1',
      '2': 'dropActive2',
      '3': 'dropActive3'
    },

    pickerId: null,
    moreBtnList: ['项目进度状态', '项目工期追踪'],
    moreBtnIndex: null
  },

  searchTitle(e) {
    this.setData({
      pageNo: 1,
      pageSize: 5,
      projectSearch: e.detail.value
    }, () => { this.getProjectData(); })
  },

  //  项目类型change事件
  onDropProjectTypeChange(e) {
    this.setData({
      pageNo: 1,
      pageSize: 5,
      dropActive: 1,
      'projectType.value': e.detail.value,
    }, ()=> {
      this.getProjectData();
    });
  },

  //  项目资金change事件
  onDropProjectMoneyChange(e) {
    this.setData({
      pageNo: 1,
      pageSize: 5,
      dropActive: 2,
      'projectMoney.value': e.detail.value,
    }, ()=> {
      this.getProjectData();
    });
  },

  //  项目领域change事件
  onDropProjectAreaChange(e) {
    this.setData({
      pageNo: 1,
      pageSize: 5,
      dropActive: 3,
      'projectArea.value': e.detail.value,
    }, ()=> {
      this.getProjectData();
    });
  },

  // // 展示更多按钮
  // toShowMoreBtn(e) {
  //   const index = e.currentTarget.dataset.index;
  //   this.setData({ moreBtnIndex: this.data.moreBtnIndex == index ? null : index });
  // },

  //  项目走访
  toProjectInterview(e) {
    wx.navigateTo({
      url: '/pages/subPagesForEcharts/pages/projectInterview/projectInterview?id=' + e.currentTarget.dataset.id
    });
  },

  //  项目追踪
  toProjectTrack(e) {
    wx.navigateTo({
      url: '/pages/subPagesForEcharts/pages/projectTrack/projectTrack?id=' + e.currentTarget.dataset.id
    });
  },

  bindPickerChange(e) {
    const index = e.detail.value;
    this.setData({
      moreBtnIndex: index
    }, () => {
      if(index == 0) this.toProjectStatus();
      if(index == 1) this.toProjectProgress();
    });
  },

  toShowMorePicker(e) {
    this.setData({ pickerId: e.currentTarget.dataset.id });
  },
  
  //  项目状态跟进
  toProjectStatus(e) {
    wx.navigateTo({
      url: '/pages/subPagesForEcharts/pages/projectStatus/projectStatus?id=' + this.data.pickerId
    });
  },
  
  //  项目进展
  toProjectProgress(e) {
    wx.navigateTo({
      url: '/pages/subPagesForEcharts/pages/projectProgress/projectProgress?id=' + this.data.pickerId
    });
  },

  getProjectData() {
    wx.showLoading({
      title: '加载中',
    });
    const params = {
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize,
      proNameOrCode: this.data.projectSearch,
      projectType: this.data.projectType.value,
      capitalType: this.data.projectMoney.value,
      territory: this.data.projectArea.value
    };
    fetch.get('/project/projectInfo/getPageProjectFollowUp', params).then(res => {
      if(res.code == 200) {
        this.setData({
          projectList: this.data.pageNo > 1 ? this.data.projectList.concat(res.result.records) : res.result.records,
          nomore: res.result.current >= res.result.pages ? true : false
        }, () => {
          wx.hideLoading();
        });
      };
    });
  },

  getAllDict() {
    wx.showLoading({
      title: '加载中',
    });
    fetch.get('/project/projectInfo/queryAllDict').then(res => {
      this.setData({
        'projectType.options': res.result.project_type,
        'projectMoney.options': res.result.capital_type,
        'projectArea.options': res.result.territory
      }, () => {
        wx.hideLoading();
      });
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getAllDict();
    this.getProjectData();
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
      projectSearch: '',
      'projectType.value': '',
      'projectMoney.value': '',
      'projectArea.value': '',
      projectList: [],
      pageNo: 1,
      pageSize: 5
    }, ()=> {
      this.getProjectData();
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
      this.getProjectData();
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})