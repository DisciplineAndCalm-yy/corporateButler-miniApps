// pages/subPagesForEcharts/pages/projectStatusRecord/projectStatusRecord.js
import { baseUrl, fetch } from '../../../../utils/util.js';
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
    list: [],
    statusMap: {},
    pageNo: 1,
    pageSize: 10,
    nomore: false
  },
  
  // 预览图片
  previewImg: function (e) {
    let list = [];
    let src = e.currentTarget.dataset.src;
    list.push(src);
    wx.previewImage({
      //当前显示图片
      current: list[0],
      //所有图片
      urls: list
    });
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

  // 获取记录
  getList() {
    wx.showLoading({
      title: '加载中',
    });
    const params = {
      projectInfoId: this.data.projectId,
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize
    };
    fetch.get('/project/projectProgressStatusLog/list', params).then(res => {
      if(res.code == 200) {
        res.result.records.map(el => {
          if(el.pathList) el.pathList.src = baseUrl.replace('/jeecgboot', '') + el.pathList.tempPath;
        });
        this.setData({
          list: this.data.pageNo > 1 ? this.data.list.concat(res.result.records) : res.result.records,
          nomore: res.result.current >= res.result.pages ? true : false
        }, () => {
          wx.hideToast();
          wx.hideLoading();
        });
      };
    });
  },

  // 获取项目进度状态
  getDictList() {
    wx.showLoading({
      title: '加载中',
    });
    fetch.get('/sys/dict/getDictItems/project_info_phase').then(res => {
      let statusMap = {};
      res.result.map(el => statusMap[el.value] = (el.label));
      this.setData({
        statusMap
      }, () => {
        wx.hideToast();
        wx.hideLoading();
      });
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      projectId: options.id ? options.id : null
    }, () => {
      this.getProjectInfo();
      this.getDictList();
      this.getList();
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