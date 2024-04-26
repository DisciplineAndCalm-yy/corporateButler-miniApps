// pages/subPagesForLeader/pages/projectProvinceDetail/projectProvinceDetail.js
import { fetch, formatTime } from '../../../../utils/util.js';
const app = getApp();
import * as echarts from '../../component/ec-canvas/echarts';
var option = [];  //图表配置项 声明
// 初始化图表函数  开始
let chart = null;
function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  });
  canvas.setChart(chart);
  return chart;
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
    provinceTpye: 1,
    titleMap: {
      1: '省级重点项目',
      2: '市级重点项目',
      3: '县级重点项目'
    },
    titles: '重点项目',
    toDay: '',
    startDate: '',
    endDate: '',
    lineData: [],
    lineData2: [],
    lineXData: [],
    projectInfoData: {},
    projectList: [],
    // echart初始化
    ec: {
      onInit: initChart
    }
  },

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
 
  // 跳转项目库
  handleJumpStore() {
    app.globalData.leaderTabIndex = 2;
    wx.navigateTo({
      url: `/pages/subPagesForLeader/pages/publicProjectStore/publicProjectStore?searchType=6&searchValue=${this.data.provinceTpye}&startDate=${this.data.startDate}&endDate=${this.data.endDate}`
    });
  },

  // 获取数据
  getProvinceData() {
    wx.showLoading({
      title: '加载中',
    });
    const params = {
      startTime: this.data.startDate,
      endTime: this.data.endDate,
      ssKeyFlag: this.data.provinceTpye
    };
    fetch.get('/wx/project/projectStatics/getKeyProjectStaticBySsVxVo', params).then(res => {
      wx.hideLoading();
      if(res.code == 200) {
        let lineData = [], lineData2 = [], lineXData = [], projectInfoData = {}, projectList = [];
        res.result.projectPromotionPlanVoList.map(el => {
          lineData.push(el.curMonthInvest);
          lineData2.push(el.curMonthTotalInvest);
          lineXData.push(el.monthStr);
        });
        projectInfoData = res.result.keyProjectPhaseStaticsBySsVxVo;
        if(res.result.keyProjectStaticsListVxVoList) {
          res.result.keyProjectStaticsListVxVoList.map(el => {
            el.percent = el.completionPercentage.replace('%', '');
          });
        };
        projectList = res.result.keyProjectStaticsListVxVoList;
        this.setData({
          lineData,
          lineData2,
          lineXData,
          projectInfoData,
          projectList
        }, () => {
          this.drawLine();
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    if(options || options.provinceTpye) this.setData({ provinceTpye: options.provinceTpye });
    const toDay = formatTime(new Date(), '-', true);
    const date = new Date();
    const year = date.getFullYear();
    const firstDay = `${year}-01-01`;
    this.setData({
      toDay,
      startDate: firstDay,
      endDate: toDay
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