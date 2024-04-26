// pages/subPagesForEcharts/pages/projectInterviewRecord/projectInterviewRecord.js
import { fetch } from '../../../../utils/util.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuHeight: app.globalData.menuHeight,
    menuTop: app.globalData.menuTop,
    projectId: '',
    recordList: [],
    pageNo: 1,
    pageSize: 10,
    nomore: false,
    startX: 0,
    startY: 0
  },
  
  getRecordDatas() {
    wx.showLoading({
      title: '加载中',
    });
    const params = {
      projectInfoId: this.data.projectId,
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize
    };
    fetch.get('/project/projectInterviewRecords/listPageByProjectInfoId', params).then(res => {
      if(res.code == 200) {
        this.setData({
          recordList: this.data.pageNo > 1 ? this.data.recordList.concat(res.result.records) : res.result.records,
          nomore: res.result.current >= res.result.pages ? true : false
        }, () => {
          wx.hideLoading();
        });
      };
    });
  },

  touchStart: function(e) {
    let dataList = [...this.data.recordList];
    dataList.forEach(item => {
      if(item.isTouchMove) {
        item.isTouchMove = !item.isTouchMove;
      };
    });
    this.setData({
      shopList: dataList,
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY
    });
  },

  touchMove: function(e) {
    let moveX = e.changedTouches[0].clientX;
    let moveY = e.changedTouches[0].clientY;
    let indexs = e.currentTarget.dataset.index;
    let dataList = [...this.data.recordList]

    let angle = this.angle({
      X: this.data.startX,
      Y: this.data.startY
    }, {
      X: moveX,
      Y: moveY
    });

    dataList.forEach((item, index) => {
      item.isTouchMove = false;
      // 如果滑动的角度大于30° 则直接return；
      if(angle > 30) {
        return
      };

      if(indexs === index) {
        if(moveX > this.data.startX) { // 右滑
          item.isTouchMove = false;
        } else { // 左滑
          item.isTouchMove = true;
        };
      };
    });

    this.setData({
      recordList: dataList
    });
  },

  //计算角度
  angle: function(start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },

  toDetail(e) {
    wx.navigateTo({
      url: '/pages/subPagesForEcharts/pages/projectInterview/projectInterview?id='+ this.data.projectId + '&interviewId=' + e.currentTarget.dataset.id
    });
  },

  toDelete(e) {
    wx.showLoading({
      title: '加载中',
    });
    fetch.delete('/project/projectInterviewRecords/delete', { id: e.currentTarget.dataset.id }, { 'content-type': 'application/x-www-form-urlencoded' }).then(res => {
      if(res.code == 200) {
        wx.showToast({
          title: res.message,
          icon: 'none'
        });
        this.setData({
          recordList: [],
          pageNo: 1,
          pageSize: 10
        }, ()=> {
          this.getRecordDatas();
          wx.hideLoading();
        });
      };
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      projectId: options.id ? options.id : ''
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
    this.getRecordDatas();
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
      recordList: [],
      pageNo: 1,
      pageSize: 10
    }, ()=> {
      this.getRecordDatas();
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
      this.getRecordDatas();
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})