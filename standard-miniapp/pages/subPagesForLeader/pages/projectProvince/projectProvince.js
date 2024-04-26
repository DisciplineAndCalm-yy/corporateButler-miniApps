// pages/subPagesForLeader/pages/projectProvince/projectProvince.js
import { fetch, formatTime, fomatFloat } from '../../../../utils/util.js';
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
    // 总金额
    totalMoneyList: [],
    totalColorMap: {
      1: '',
      2: 'orange_bg',
      3: 'green_bg'
    },
    allList: [],
    progressActiveMap: {
      '1': '#187FFF',
      '2': '#F95D13',
      '3': '#34CC9F'
    },
    progressColorMap: {
      '1': '#DCECFF',
      '2': '#FFE5E5',
      '3': '#DEFFF5'
    },
    progressPercentMap: {
      '1': '',
      '2': 'progress_orange',
      '3': 'progress_green'
    }
  },

  // 获取数据
  getProvinceData() {
    wx.showLoading({
      title: '加载中',
    });
    const params = {
      startTime: this.data.startDate,
      endTime: this.data.endDate
    };
    fetch.get('/wx/project/projectStatics/ssKeyFlagStatics', params).then(res => {
      wx.hideLoading();
      if(res.code == 200) {
        let totalMoneyList = [], allList = [];
        totalMoneyList = res.result.keyProjectSsFlagStaticsWxVoList || [];
        res.result.keyProjectStaticsWxVoList.map(el => {
          if(el.ssKeyFlag == 1) {
            el.keyProjectPhaseStaticsWxVoList.map(item => {
              item.percent = fomatFloat((item.projectPhaseNum/el.projectNum)*100, 2);
            });
          };
          if(el.ssKeyFlag == 2) {
            el.keyProjectPhaseStaticsWxVoList.map(item => {
              item.percent = fomatFloat((item.projectPhaseNum/el.projectNum)*100, 2);
            });
          };
          if(el.ssKeyFlag == 3) {
            el.keyProjectPhaseStaticsWxVoList.map(item => {
              item.percent = fomatFloat((item.projectPhaseNum/el.projectNum)*100, 2);
            });
          };
        });
        allList = res.result.keyProjectStaticsWxVoList;
        this.setData({
          totalMoneyList,
          allList
        });
      };
    });
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
    }, () => this.getProvinceData());
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
    }, () => this.getProvinceData());
  },

  // 查看详细名称
  openShowDetail(e) {
    const desc = e.currentTarget.dataset.desc;
    this.setData({
      visible: true,
      detailName: desc
    });
  },

  // 关闭弹窗
  closeShowmore() {
    this.setData({
      visible: false
    });
  },

  // 查看清单
  toShowList(e) {
    const type = e.currentTarget.dataset.type;
    app.globalData.leaderTabIndex = 2;
    wx.navigateTo({
      url: `/pages/subPagesForLeader/pages/publicProjectStore/publicProjectStore?searchType=6&searchValue=${type}&startDate=${this.data.startDate}&endDate=${this.data.endDate}`
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
      startDate: options.startDate || firstDay,
      endDate: options.endDate || toDay
    });
    this.getProvinceData();
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