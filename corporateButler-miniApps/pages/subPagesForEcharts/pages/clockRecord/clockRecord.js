// pages/subPagesForEcharts/pages/clockRecord/clockRecord.js
const app = getApp();
const { fetch, baseUrl } = require("../../../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
    startDate: '',
    endDate: '',
    searchStartDate: 'xxxx-xx-xx',
    searchEndDate: 'xxxx-xx-xx',
    recordList: [],
    pageNo: 1,
    pageSize: 5,
    nomore: false,
    visible: false,
    lastDateIndex: null
  },

  async getRecordList() {
    wx.showLoading({
      title: '加载中',
    });
    const params = {
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize,
      startDate: this.data.startDate,
      endDate: this.data.endDate
    };
    fetch.get('/enterprise/entMangerRecord/currentUser/list', params).then(res => {
      if(res.code == 200) {
        let list = res.result.records;
        if(list != null) {
          list.map(el => {
            el.imgSrc = baseUrl.replace('/jeecgboot', '') + el.tempFilePath;
          });
        };
        this.setData({
          recordList: this.data.pageNo > 1 ? this.data.recordList.concat(list) : list,
          nomore: res.result.current >= res.result.pages ? true : false
        }, () => {
          wx.hideLoading();
        });
      };
    });
  },

  openSeachPopup() {
    this.setData({
      visible: true,
      lastDateIndex: null,
      searchStartDate: this.data.startDate,
      searchEndDate: this.data.endDate,
      isCustom: false
    });
  },

  closeSearchPopup() {
    this.setData({
      visible: false
    });
  },

  changeLastDate(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      lastDateIndex: index
    }, () => {
      this.changeDate();
    });
  },

  changeDate() {
    const dateIndex = this.data.lastDateIndex;
    let startDate, endDate = '';
    let date = new Date();
    switch(dateIndex) {
      case '0':
        console.log('week');
        break;
      case '1':
        console.log('month');
        break;
      case '2':
        console.log('halfyear');
        break;
      default:
        break;
    };
    this.setData({
      startDate,
      endDate
    });
  },
  
  // 开始时间
  bindCustomStartDateChange(e) {
    this.setData({
      searchStartDate: e.detail.value
    });
  },
  
  // 结束时间
  bindCustomEndDateChange(e) {
    this.setData({
      searchEndDate: e.detail.value
    });
  },

  // 确认查询
  cofirmSearchClock() {
    this.setData({
      startDate: this.data.searchStartDate,
      endDate: this.data.searchEndDate,
      visible: false
    }, () => {
      this.getRecordList();
    });
  },

  // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
    let imgSrc = e.currentTarget.dataset.imgsrc;
    let fileList = [];
    fileList.push(imgSrc);
    wx.previewImage({
      //当前显示图片
      current: imgSrc,
      //所有图片
      urls: fileList
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getRecordList();
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
      recordList: [],
      pageNo: 1,
      pageSize: 5
    }, ()=> {
      this.getRecordList();
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
      this.getRecordList();
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})