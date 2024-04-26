// pages/subPagesForLeader/pages/homeLeader/homeLeader.js
import { fetch, formatTime } from '../../../../utils/util.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
    topMenuIndex: 1,
    rankData: [],
    visible: false,
    detailName: '',
    // 公共部分
    colorList: ['', 'complain_orange', 'complain_green', 'complain_yellow'],
    bgColorList: ['', 'complain_orange_bg', 'complain_green_bg', 'complain_yellow_bg'],
    // 重大项目数据
    toDay: '',
    activeDate: 0,
    toptDate: '',
    toppDate: '',
    pmStartDate: '',
    pmEndDate: '',
    pmDatas: [],
    ppStartDate: '',
    ppEndDate: '',
    ppDatas: [],
    ppIconList: ['icon-ld-kaigong', 'icon-ld-jungong', 'icon-ld-touchan', 'icon-ld-daxiao'],
    ppDeepColorList: ['', 'progress_deepcolor_orange', 'progress_deepcolor_green', 'progress_deepcolor_yellow'],
    superviseList: [],
    superviseProgressMap: {
      '2': '',
      '3': 'supervise_iconcolor_orange',
      '4': 'supervise_iconcolor_red'
    },
    moreSupervise: false,
    // 督办弹窗
    superviseVisible: false,
    superviseInfo: {},
    activeHeight: 0,
    // 政策数据
    policyTotal: {},
    policyTagList: [],
    // 诉求数据
    begThingsIndex: 1,
    begComplainIndex: 0,
    begTotals: {},
    begThingsTotal: {},
    stewardTotalData: {},
    begComplainTotals: 0,
    begComplainData: [],
    departRankList: [],
    rankIconList: {
      '1': 'rank_first',
      '2': 'rank_second',
      '3': 'rank_third'
    }
  },

  // 跳转项目统管详情
  toSwitchProject(e) {
    const type = e.currentTarget.dataset.type;
    switch(type) {
      case 1:
        wx.navigateTo({
          url: `/pages/subPagesForLeader/pages/projectProvince/projectProvince?startDate${this.data.pmStartDate}&endDate=${this.data.pmEndDate}`
        });
        break;
      case 2:
        wx.navigateTo({
          url: `/pages/subPagesForLeader/pages/projectThree/projectThree?startDate${this.data.pmStartDate}&endDate=${this.data.pmEndDate}`
        });
        break;
      case 3:
        wx.navigateTo({
          url: `/pages/subPagesForLeader/pages/projectCentre/projectCentre`
        });
        break;
      case 4:
        wx.navigateTo({
          url: `/pages/subPagesForLeader/pages/projectSpecial/projectSpecial`
        });
        break;
      default:
        break;
    };
  },

  // 省、市、县重点项目
  toProvince(e) {
    const provinceTpye = e.currentTarget.dataset.provincetpye;
    wx.navigateTo({
      url: `/pages/subPagesForLeader/pages/projectProvinceDetail/projectProvinceDetail?provinceTpye=${provinceTpye}`
    });
  },

  // 项目统管：统计开始时间
  bindpmStartDateChange(e) {
    if(this.data.pmEndDate != '' && this.data.pmEndDate < e.detail.value) {
      wx.showToast({
        title: '开始时间不可以大于结束时间',
        icon: 'none',
        duration: 2000
      });
      return
    };
    const toDate = formatTime(new Date(), '-', false);
    this.setData({
      pmStartDate: e.detail.value,
      toptDate: toDate
    }, () => this.getProjectManagement());
  },
  
  // 项目统管：统计结束时间
  bindpmEndDateChange(e) {
    if(this.data.pmStartDate != '' && this.data.pmStartDate > e.detail.value) {
      wx.showToast({
        title: '结束时间不可以小于开始时间',
        icon: 'none',
        duration: 2000
      });
      return
    };
    const toDate = formatTime(new Date(), '-', false);
    this.setData({
      pmEndDate: e.detail.value,
      toptDate: toDate
    }, () => this.getProjectManagement());
  },
  
  // 项目进展统一调度：统计开始时间
  bindppStartDateChange(e) {
    if(this.data.ppEndDate != '' && this.data.ppEndDate < e.detail.value) {
      wx.showToast({
        title: '开始时间不可以大于结束时间',
        icon: 'none',
        duration: 2000
      });
      return
    };
    const toDate = formatTime(new Date(), '-', false);
    this.setData({
      ppStartDate: e.detail.value,
      toppDate: toDate
    }, () => this.getProjectProgressData());
  },
  
  // 项目进展统一调度：统计结束时间
  bindppEndDateChange(e) {
    if(this.data.ppStartDate != '' && this.data.ppStartDate > e.detail.value) {
      wx.showToast({
        title: '结束时间不可以小于开始时间',
        icon: 'none',
        duration: 2000
      });
      return
    };
    const toDate = formatTime(new Date(), '-', false);
    this.setData({
      ppEndDate: e.detail.value,
      toppDate: toDate
    }, () => this.getProjectProgressData());
  },

  // 获取项目统管数据
  getProjectManagement() {
    wx.showLoading({
      title: '加载中',
    });
    const params = {
      startTime: this.data.pmStartDate,
      endTime: this.data.pmEndDate
    };
    fetch.get('/wx/project/projectStatics/getProjectStaticsManageWxVo', params).then(res => {
      wx.hideLoading();
      if(res.code == 200) {
        this.setData({ pmDatas: res.result });
      };
    });
  },
  
  // 获取项目进展统一调度数据
  getProjectProgressData() {
    wx.showLoading({
      title: '加载中',
    });
    const params = {
      startTime: this.data.ppStartDate,
      endTime: this.data.ppEndDate
    };
    fetch.get('/wx/project/projectStatics/listProjectPhaseStaticsWxVo', params).then(res => {
      wx.hideLoading();
      if(res.code == 200) {
        let list = res.result;
        list.forEach(el => {
          el.phaseName = el.phaseName.split('（')[0];
        });
        this.setData({ ppDatas: list });
      };
    });
  },

  // 获取项目督办前五条数据
  getSuperviseData() {
    wx.showLoading({
      title: '加载中',
    });
    fetch.get('/wx/project/projectInfo/remindList').then(res => {
      wx.hideLoading();
      if(res.code == 200) {
        let list = [], moreSupervise = false;
        if(res.result.length > 5) {
          list = res.result.splice(0, 5);
          moreSupervise = true;
        } else {
          list = res.result;
        };
        this.setData({ superviseList: list, moreSupervise });
      };
    });
  },

  // 获取整体排名
  getRankData() {
    wx.showLoading({
      title: '加载中',
    });
    fetch.get('/optimus-prime/bigScreen/overAllData').then(res => {
      wx.hideLoading();
      if(res.code == 200) {
        this.setData({ rankData: res.result });
      };
    });
  },

  // 获取政策统计数据
  getPolicyTotals() {
    wx.showLoading({
      title: '加载中',
    });
    fetch.get('/policy/largeScreen/pushPolicy').then(res => {
      wx.hideLoading();
      if(res.code == 200) {
        this.setData({ policyTotal: res.result });
      };
    });
  },

  // 获取政策订阅标签前十
  getPolicyTagTop() {
    wx.showLoading({
      title: '加载中',
    });
    fetch.get('/policy/dashboard/policyLabelSubscribeTop10').then(res => {
      wx.hideLoading();
      if(res.code == 200) {
        this.setData({ policyTagList: res.result });
      };
    });
  },

  // 诉求顶部及事项处理统计
  getLeaderBegTotals() {
    wx.showLoading({
      title: '加载中',
    });
    fetch.post('/qixian/statistics/leadershipData').then(res => {
      wx.hideLoading();
      if(res.code == 200) {
        this.setData({
          begTotals: res.result,
          begThingsTotal: this.data.begThingsIndex == 1 ? res.result.troubleshoot : res.result.problemFeedback
        });
      };
    });
  },

  // 服务管家统计
  getStewardTotal() {
    wx.showLoading({
      title: '加载中',
    });
    fetch.get('/enterprise/entMangerRecord/leader/report').then(res => {
      wx.hideLoading();
      if(res.code == 200) {
        this.setData({ stewardTotalData: res.result });
      };
    });
  },

  // 获取事项投诉类型排行
  getThingsComplainData() {
    wx.showLoading({
      title: '加载中',
    });
    fetch.get('/qixian/statistics/leaderAppealRanking', { type: this.data.begComplainIndex }).then(res => {
      wx.hideLoading();
      if(res.code == 200) {
        this.setData({
          begComplainTotals: res.result.count,
          begComplainData: res.result.itemData
        });
      };
    });
  },

  // 获取部门评价排名
  getDepartRankData() {
    wx.showLoading({
      title: '加载中',
    });
    fetch.get('/qixian/statistics/leaderDepartRanking').then(res => {
      wx.hideLoading();
      if(res.code == 200) {
        this.setData({
          departRankList: res.result
        });
      };
    });
  },

  // 跳转政策库
  toPolicyStore() {
    app.globalData.leaderTabIndex = 1;
    wx.redirectTo({
      url: '/pages/subPagesForLeader/pages/publicPolicyStore/policyStore'
    });
  },
  
  // 跳转项目库
  handleJumpStore(e) {
    const type = e.currentTarget.dataset.type;
    app.globalData.leaderTabIndex = 2;
    wx.navigateTo({
      url: `/pages/subPagesForLeader/pages/publicProjectStore/publicProjectStore?searchType=4&searchValue=${type}&startDate=${this.data.ppStartDate}&endDate=${this.data.ppEndDate}`
    });
  },

  // 顶部菜单切换
  changeTopMenu(e) {
    const index = e.currentTarget.dataset.menuindex;
    // index：1、重大项目；2、企业诉求；3、惠企政策
    // 切换 tab 重新调用接口刷新数据
    if(index == 1) {
      this.getProjectManagement();
      this.getProjectProgressData();
      this.getSuperviseData();
    } else if(index == 2) {
      this.getLeaderBegTotals();
      this.getStewardTotal();
      this.getThingsComplainData();
      this.getDepartRankData();
    } else if(index == 3) {
      this.getPolicyTotals();
      this.getPolicyTagTop();
    };
    this.setData({ topMenuIndex: index });
  },

  // 切换诉求事项处理统计tab
  changeBegThingsMenu(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      begThingsIndex: index,
      begThingsTotal: index == '1' ? this.data.begTotals.troubleshoot : this.data.begTotals.problemFeedback
    });
  },

  // 切换诉求事项投诉类型排行tab
  changeBegComplainMenu(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ begComplainIndex: index }, () => this.getThingsComplainData() );
  },

  // 跳转督办记录页面
  toSuperviseRecord() {
    wx.navigateTo({
      url: '/pages/subPagesForLeader/pages/superviseRecord/superviseRecord'
    });
  },

  // 跳转项目督办页面
  toShowMore() {
    wx.navigateTo({
      url: '/pages/subPagesForLeader/pages/superviseProject/superviseProject',
    });
  },
  
  // 查看进展
  toLookProgression(e) {
    wx.navigateTo({
      url: '/pages/subPagesForLeader/pages/projectDetail/projectDetail?id=' + e.currentTarget.dataset.id + '&isPoint=false'
    });
  },

  // 打开督办弹窗-获取督办信息
  openSupervisePopup(e) {
    const pid = e.currentTarget.dataset.pid;
    wx.showLoading({
      title: '加载中',
    });
    fetch.get('/project/projectSupervision/queryByProjectId', { projectId: pid }).then(res => {
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
      projectId: this.data.superviseInfo.projectId,
      content: e.detail.value.textarea
    };
    fetch.post('/project/projectSupervision/add', params, { 'content-type': 'application/x-www-form-urlencoded' }).then(res => {
      wx.hideLoading();
      if(res.code == 200) {
        wx.showToast({
          title: res.message,
          icon: 'none'
        });
        setTimeout(() => {
          that.setData({
            superviseVisible: false
          });
        }, 1000);
      };
    });
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

  // 输入框聚焦
  focusText() {
    const that = this;
    wx.onKeyboardHeightChange(res => {
      that.setData({
        activeHeight: res.height
      });
    });
  },
  
  // 输入框失焦
  blurText() {
    const that = this;
    wx.onKeyboardHeightChange(res => {
      that.setData({
        activeHeight: res.height
      });
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getRankData();
    const toDay = formatTime(new Date(), '-', true);
    const toDate = formatTime(new Date(), '-', false);
    const date = new Date();
    const year = date.getFullYear();
    const firstDay = `${year}-01-01`;
    this.setData({
      toDay,
      toptDate: toDate,
      toppDate: toDate,
      pmStartDate: firstDay,
      pmEndDate: toDay,
      ppStartDate: firstDay,
      ppEndDate: toDay
    });
    this.getProjectManagement();
    this.getProjectProgressData();
    this.getSuperviseData();
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