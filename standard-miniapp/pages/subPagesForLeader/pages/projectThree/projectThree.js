// pages/subPagesForLeader/pages/projectThree/projectThree.js
import { fetch, formatTime, fomatFloat } from '../../../../utils/util.js';
const app = getApp();
import * as echarts from '../../component/ec-canvas/echarts';
var option = [], options = [];  //图表配置项 声明
// 初始化图表函数  开始
let chart = null, charts = null;
function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  });
  canvas.setChart(chart);
  return chart;
};
function initCharts(canvas, width, height, dpr) {
  charts = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  });
  canvas.setChart(charts);
  return charts;
};

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
    phaseIndex: 0,
    phaseValue: '',
    phaseList: [],
    lineData: [],
    lineData2: [],
    lineXData: [],
    projectInfoData: {},
    projectProgessData: {},
    ringData: [],
    // echart初始化
    ec: {
      onInit: initChart
    },
    ec1: {
      onInit: initCharts
    },
  },

  // 获取阶段
  getPhaseData() {
    wx.showLoading({
      title: '加载中',
    });
    fetch.get('/module-project/projectPeriods/getAllPeriods', { orderType: 2 }).then(res => {
      wx.hideLoading();
      if(res.code == 200) {
        this.setData({
          phaseList: res.result,
          phaseValue: res.result[0].value || ''
        }, () => this.getDatas());
      };
    });
  },

  // 切换阶段
  handlePhase(e) {
    const idx = e.currentTarget.dataset.idx;
    const phaseValue = e.currentTarget.dataset.phasevalue;
    this.setData({ phaseIndex: idx, phaseValue }, () => this.getDatas());
  },
  
  // 开始时间
  bindStartDateChange(e) {
    this.setData({
      startDate: e.detail.value
    }, () => this.getDatas());
  },
  
  // 结束时间
  bindEndDateChange(e) {
    this.setData({
      endDate: e.detail.value
    }, () => this.getDatas());
  },

  // 根据阶段获取数据
  getDatas() {
    this.getLineData();
    this.getProjectPhaseData();
    this.getProjectTypeData();
  },

  // 获取按月份折线图数据
  getLineData() {
    wx.showLoading({
      title: '加载中',
    });
    const params = {
      startTime: this.data.startDate,
      endTime: this.data.endDate,
      periodsNo: this.data.phaseValue
    };
    fetch.get('/wx/project/projectStatics/listSgypProjectMonthStatic', params).then(res => {
      wx.hideLoading();
      if(res.code == 200) {
        let lineData = [], lineData2 = [], lineXData = [];
        res.result.map(el => {
          lineData.push(el.curMonthInvest);
          lineData2.push(el.curMonthTotalInvest);
          lineXData.push(el.monthStr);
        });
        this.setData({ lineData, lineData2, lineXData }, () => this.drawLine() );
      };
    });
  },

  // 获取项目阶段统计数据-项目信息数据
  getProjectPhaseData() {
    wx.showLoading({
      title: '加载中',
    });
    const params = {
      startTime: this.data.startDate,
      endTime: this.data.endDate,
      periodsNo: this.data.phaseValue
    };
    fetch.get('/wx/project/projectStatics/getSgypProjectPhaseStaticsWxVo', params).then(res => {
      wx.hideLoading();
      if(res.code == 200) {
        let ringData = [];
        ringData.push({ name: '在建（已开工）', value: res.result.startWorkPhaseNum || 0 });
        ringData.push({ name: '竣工', value: res.result.endWorkingPhaseNum || 0 });
        ringData.push({ name: '达效', value: res.result.achieveEffectPhaseNum || 0 });
        this.setData({ projectInfoData: res.result, ringData }, () => { this.drawRing() });
      };
    });
  },

  // 获取项目类型统计数据-进度条项目数据
  getProjectTypeData() {
    wx.showLoading({
      title: '加载中',
    });
    const params = {
      startTime: this.data.startDate,
      endTime: this.data.endDate,
      periodsNo: this.data.phaseValue
    };
    fetch.get('/wx/project/projectStatics/getSgypProjectNatureStaticsWxVo', params).then(res => {
      wx.hideLoading();
      if(res.code == 200) {
        let projectProgessData = res.result;
        projectProgessData.signPercent = fomatFloat(projectProgessData.signExpectTotalInvestment/projectProgessData.signPlanTotalInvestment * 100, 2);
        projectProgessData.startPercent = fomatFloat(projectProgessData.startExpectTotalInvestment/projectProgessData.startPlanTotalInvestment * 100, 2);
        projectProgessData.completionPercent = fomatFloat(projectProgessData.completionExpectTotalInvestment/projectProgessData.completionPlanTotalInvestment * 100, 2);
        this.setData({ projectProgessData });
      };
    });
  },

  // 折线图
  drawLine() {
    option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['累计投资', '当月投资'],
        right: '0',
        icon: "circle"
      },
      color: ['#FA6C32', '#007DFF'],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: this.data.lineXData,
        axisTick: {
          show: false
        },
        axisLabel: {
          interval: 0
        }
      },
      yAxis: {
        name: '万元',
        type: 'value'
      },
      series: [
        {
          name: '累计投资',
          type: 'line',
          data: this.data.lineData2,
          smooth: true
        },
        {
          name: '当月投资',
          type: 'line',
          data: this.data.lineData,
          smooth: true
        }
      ]
    };
    // 输出到页面
    setTimeout(() => {
      chart.setOption(option);
    }, 500);
  },
  
  // 环形图
  drawRing() {
    options = {
      color: ['#187FFF', '#13CA03', '#E29147'],
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 12,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: this.data.ringData
        }
      ]
    };
    // 输出到页面
    setTimeout(() => {
      charts.setOption(options);
    }, 500);
  },

  // 跳转项目库
  handleJumpStore(e) {
    const type = e.currentTarget.dataset.type;
    app.globalData.leaderTabIndex = 2;
    wx.navigateTo({
      url: `/pages/subPagesForLeader/pages/publicProjectStore/publicProjectStore?searchType=5&searchValue=${type}&startDate=${this.data.startDate}&endDate=${this.data.endDate}`
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
    this.getPhaseData();
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