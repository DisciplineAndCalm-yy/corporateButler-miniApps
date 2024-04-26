// pages/subPagesForLeader/pages/superviseRecord/superviseRecord.js
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
    recordList: [{}],
    pageSize: 10,
    pageNo: 1,
    nomore: true,
    // 督办弹窗
    superviseVisible: false,
    superviseInfo: {}
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
    }, () => this.getRecordData());
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
    }, () => this.getRecordData());
  },

  // 获取督办数据-分页
  getRecordData() {
    wx.showLoading({
      title: '加载中',
    });
    const params = {
      startTime: this.data.startDate,
      endTime: this.data.endDate,
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize
    };
    fetch.get('/project/projectSupervision/list', params).then(res => {
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

  // 删除督办记录
  toDeleteSupervise(e) {
    const id = e.currentTarget.dataset.id;
    const that = this;
    wx.showLoading({
      title: '加载中',
    });
    fetch.post('/project/projectSupervision/delete', { id }, { 'content-type': 'application/x-www-form-urlencoded' }).then(res => {
      wx.hideLoading();
      if(res.code == 200) {
        wx.showToast({
          title: res.message,
          icon: 'none'
        });
        setTimeout(() => {
          that.setData({
            pageNo: 1,
            pageSize: 10
          }, () => { that.getRecordData() });
        }, 1000);
      };
    });
  },

  // 查看进展
  handleToDetail(e) {
    wx.navigateTo({
      url: '/pages/subPagesForLeader/pages/projectDetail/projectDetail?id=' + e.currentTarget.dataset.id + '&isPoint=false'
    });
  },

  // 打开督办弹窗-获取督办信息
  openSupervisePopup(e) {
    const id = e.currentTarget.dataset.id;
    wx.showLoading({
      title: '加载中',
    });
    fetch.get('/project/projectSupervision/queryById', { id }).then(res => {
      wx.hideLoading();
      if(res.code == 200) {
        this.setData({
          superviseInfo: res.result,
          superviseVisible: true
        });
      };
    });
  },

  onSuperviseVisibleChange(e) {
    this.setData({
      superviseVisible: e.detail.visible
    });
  },

  // 关闭督办弹窗
  closeSupervisePopup() {
    this.setData({
      superviseVisible: false
    });
  },

  // 拨打电话
  toCallPhone(e) {
    const phoneNumber = e.currentTarget.dataset.phonenum;
    wx.makePhoneCall({
      phoneNumber: phoneNumber
    });
  },

  // 发送督办
  toPushSupervise(e) {
    if(e.detail.value.textarea.length > 200) {
      wx.showToast({
        title: '督办内容支持200字之内',
        icon: 'none'
      });
      return
    };
    wx.showLoading({
      title: '加载中',
    });
    const that = this;
    const params = {
      id: this.data.superviseInfo.id,
      content: e.detail.value.textarea
    };
    fetch.post('/project/projectSupervision/edit', params, { 'content-type': 'application/x-www-form-urlencoded' }).then(res => {
      wx.hideLoading();
      if(res.code == 200) {
        wx.showToast({
          title: res.message,
          icon: 'none'
        });
        setTimeout(() => {
          that.setData({
            superviseVisible: false,
            pageNo: 1,
            pageSize: 10
          }, () => { that.getRecordData() });
        }, 1000);
      };
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
    this.getRecordData();
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
      pageSize: 10
    }, ()=> {
      this.getRecordData();
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
      this.getRecordData();
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})