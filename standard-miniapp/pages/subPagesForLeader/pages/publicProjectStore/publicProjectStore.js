// pages/subPagesForLeader/pages/publicProjectStore/publicProjectStore.js
import { fetch, formatTime } from '../../../../utils/util.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
    // 顶部菜单
    menuIndex: '1',
    // 时间搜索
    toDay: '',
    startDate: '',
    endDate: '',
    // 项目名称检索
    searchProName: '',
    // 分页
    pageSize: 10,
    pageNo: 1,
    nomore: true,
    projectTotalInfo: {},
    totalInvest: 0,
    // 固定资产列表
    projectList: [],
    // 详细搜索固定资产
    projectInfoMap: {},
    // 中央及专项列表
    otherList: [],
    centerActive: 3,
    // 弹窗
    visible: false,
    // 类型索引
    activeType: 0,
    // 更多检索值
    searchValue: '',
    searchData: {},
    searchList: [],
    // 进度样式映射
    projectProgressMap: {
      '0': '',
      '1': 'project_iconcolor_green',
      '2': 'project_iconcolor_yellow',
      '3': 'project_iconcolor_orange',
      '4': 'project_iconcolor_red',
      '5': 'project_iconcolor_deepgreen',
    },
    centerTypeMap: {
      '0': '',
      '1': 'centertype_blue',
      '2': 'centertype_green'
    }
  },

  // 跳转获取数据
  getJumpData(options) {
    if(options && options.searchType) {
      this.setData({
        activeType: options.searchType,
        // searchValue: options.searchValue,
        startDate: options.startDate,
        endDate: options.endDate
      }, () => {
        this.getSearchTypeData();
        this.getTypeSearchList(options.searchValue);
      });
    } else {
      this.getDefultData();
    };
  },

  // 获取数据
  getData() {
    if(this.data.menuIndex == 1 && this.data.activeType == 0) {
      this.getDefultData();
    } else if(this.data.menuIndex == 2) {
      this.getCenterList();
    } else if(this.data.menuIndex == 3) {
      this.getSpecialList();
    };
  },

  // 获取固定资产默认列表数据
  getDefultData() {
    wx.showLoading({
      title: '加载中',
    });
    const params = {
      projectName: this.data.searchProName,
      startTime: this.data.startDate,
      endTime: this.data.endDate
    };
    fetch.get('/wx/project/projectInfo/listFixedAssetsInvestmentDefault', params).then(res => {
      wx.hideLoading();
      if(res.code == 200) {
        this.setData({
          projectTotalInfo: res.result.phaseNumMap,
          projectList: res.result.projectRemindVOList
        });
      };
    });
  },

  // 获取固定资产搜索列表数据
  getTypeSearchList(key) {
    wx.showLoading({
      title: '加载中',
    });
    const keys = key;
    const params = {
      searchType: this.data.activeType,
      searchValue: keys || '',
      projectName: this.data.searchProName,
      startTime: this.data.startDate,
      endTime: this.data.endDate
    };
    fetch.post('/wx/project/projectInfo/listFixedAssetsInvestment', params, { 'content-type': 'application/x-www-form-urlencoded' }).then(res => {
      wx.hideLoading();
      if(res.code == 200) {
        let projectInfoMap = {};
        for(const [key, value] of Object.entries(res.result.projectRemindVoMap)) {
          projectInfoMap.key = key;
          projectInfoMap.list = value;
        };
        projectInfoMap = projectInfoMap.key ? projectInfoMap : null;
        this.setData({
          visible: false,
          projectTotalInfo: res.result.phaseNumMap,
          projectInfoMap
        });
      };
    });
  },

  // 获取中央预算列表数据
  getCenterList() {
    wx.showLoading({
      title: '加载中',
    });
    const params = {
      proName: this.data.searchProName,
      startWork: this.data.centerActive == 3 ? '' : this.data.centerActive
    };
    fetch.get('/project/projectCentreBudget/wxList', params).then(res => {
      wx.hideLoading();
      if(res.code == 200) {
        this.setData({
          totalInvest: res.result.totalInvest,
          otherList: res.result.voList
        });
      };
    });
  },

  // 获取专项债列表数据
  getSpecialList() {
    wx.showLoading({
      title: '加载中',
    });
    const params = {
      proName: this.data.searchProName
    };
    fetch.get('/project/projectSpecialPurpose/queryPageWxList', params).then(res => {
      wx.hideLoading();
      if(res.code == 200) {
        this.setData({
          totalInvest: res.result.totalInvest,
          otherList: res.result.purposeVoList
        });
      };
    });
  },

  // 切换菜单
  changeMenu(e) {
    this.setData({ menuIndex: e.currentTarget.dataset.index }, () => this.getData() );
  },

  // 切换中央预算菜单
  changeCenterSearch(e) {
    this.setData({ centerActive: e.currentTarget.dataset.index }, () => this.getData() );
  },

  // 按项目名称搜索
  searchProjectName(e) {
    this.setData({ searchProName: e.detail.value }, () => this.getData() );
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
    }, () => this.getData());
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
    }, () => this.getData());
  },
  
  onVisibleChange(e) {
    this.setData({
      visible: e.detail.visible
    });
  },

  // 打开更多搜索弹窗
  openMoreSearch() {
    this.setData({ visible: true });
  },

  // 切换类型搜索
  changeSearchType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      searchProName: '',
      activeType: type,
      searchValue: type == 0 ? '' : this.data.searchValue,
      visible: type == 0 ? false : true
    }, () => this.getSearchTypeData() );
  },

  // 更多筛选输入框
  searchInput(e) {
    const searchValue = e.detail.value;
    let list = [];
    if(searchValue == '') {
      for(const key in this.data.searchData) {
        list.push(key);
      };
    } else {
      for(const [key, value] of Object.entries(this.data.searchData)) {
        if(value.includes(searchValue)) list.push(key);
      };
    }
    this.setData({ searchList: list });
  },

  // 按类型查询
  getSearchTypeData() {
    wx.showLoading({
      title: '加载中',
    });
    fetch.get('/wx/project/projectInfo/listOption', { type: this.data.activeType }).then(res => {
      wx.hideLoading();
      if(res.code == 200) {
        let list = [];
        for(const key in res.result) {
          list.push(key);
        };
        // for(const [key, value] of Object.entries(res.result)) {
        //   console.log(key, value);
        //   list.push(key);
        // };
        this.setData({
          searchData: res.result,
          searchList: list
        });
      };
    });
  },

  // 选中搜索
  handleSearch(e) {
    this.getTypeSearchList(e.currentTarget.dataset.key);
  },

  // 跳转详情页
  handleToDetail(e) {
    if(this.data.menuIndex == 2 || this.data.menuIndex == 3) {

      wx.navigateTo({
        url: '/pages/subPagesForLeader/pages/detailIOther/detailIOther?id=' + e.currentTarget.dataset.id + '&menuIndex=' + this.data.menuIndex
      });
    } else {
      wx.navigateTo({
        url: '/pages/subPagesForLeader/pages/projectDetail/projectDetail?id=' + e.currentTarget.dataset.id + '&isPoint=false'
      });
    }
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
    this.getJumpData(options);
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