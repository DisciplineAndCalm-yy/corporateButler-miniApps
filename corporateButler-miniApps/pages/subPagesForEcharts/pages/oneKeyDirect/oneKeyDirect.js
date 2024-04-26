// pages/subPagesForEcharts/pages/oneKeyDirect/oneKeyDirect.js
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
    oneKeyList: [],
    pageSize: 10,
    pageNo: 1,
    nomore: false
  },

  toProjectTrackOneKey(e) {
    this.setData({
      oneKeyList: [],
      pageSize: 10,
      pageNo: 1
    }, () => {
      wx.navigateTo({
        url: '/pages/subPagesForEcharts/pages/projectTrackOneKey/projectTrackOneKey?isOneKey=true&overdue=' + e.currentTarget.dataset.overdue + '&hasNotice='+ e.currentTarget.dataset.notice + '&questionId=' + e.currentTarget.dataset.id + '&projectId=' + e.currentTarget.dataset.proid
      });
    });
  },

  getDatas() {
    wx.showLoading({
      title: '加载中',
    });
    if(this.data.projectId != '') {
      const params = {
        projectInfoId: this.data.projectId,
        pageNo: this.data.pageNo,
        pageSize: this.data.pageSize
      };
      fetch.get('/project/projectQuestion/selectPageByProjectInfoId', params).then(res => {
        if(res.code == 200) {
          this.setData({
            oneKeyList: this.data.pageNo > 1 ? this.data.oneKeyList.concat(res.result.records) : res.result.records,
            nomore: res.result.current >= res.result.pages ? true : false
          }, () => {
            wx.hideLoading();
          });
        };
      });
    } else {
      const params = {
        pageNo: this.data.pageNo,
        pageSize: this.data.pageSize
      };
      fetch.post('/project/projectQuestion/wx/list', params, { 'content-type': 'application/x-www-form-urlencoded' }).then(res => {
        if(res.code == 200) {
          this.setData({
            oneKeyList: this.data.pageNo > 1 ? this.data.oneKeyList.concat(res.result.records) : res.result.records,
            nomore: res.result.current >= res.result.pages ? true : false
          }, () => {
            wx.hideLoading();
          });
        };
      });
    }
  },

  toDelete(e) {
    wx.showLoading({
      title: '加载中',
    });
    fetch.delete('/project/projectQuestion/delete', { id: e.currentTarget.dataset.id }, { 'content-type': 'application/x-www-form-urlencoded' }).then(res => {
      wx.hideLoading();
      wx.showToast({
        title: res.message,
        icon: 'none',
        duration: 2000
      });
      if(res.code == 200) {
        setTimeout(() => {
          this.setData({
            oneKeyList: [],
            pageNo: 1,
            pageSize: 10
          }, ()=> {
            this.getDatas();
            wx.hideLoading();
          });
        }, 1500);
      };
    });
  },
  
  touchStart: function(e) {
    let dataList = [...this.data.oneKeyList];
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
    let dataList = [...this.data.oneKeyList]

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
      oneKeyList: dataList
    });
  },

  //计算角度
  angle: function(start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      projectId: options.projectId ? options.projectId : ''
    }, () => {
      this.getDatas();
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
    this.getDatas();
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
      oneKeyList: [],
      pageNo: 1,
      pageSize: 10
    }, ()=> {
      this.getDatas();
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
      this.getDatas();
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})