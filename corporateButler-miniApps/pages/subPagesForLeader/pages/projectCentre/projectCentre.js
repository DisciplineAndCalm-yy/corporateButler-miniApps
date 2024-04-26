// pages/subPagesForLeader/pages/projectCentre/projectCentre.js
import { fetch, formatTime } from '../../../../utils/util.js';
const app = getApp();
import * as echarts from '../../component/ec-canvas/echarts';
var option = [], options = [];  //图表配置项 声明
// 初始化图表函数  开始
let chart = null, chart2 = null;
function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  })
  canvas.setChart(chart);
  return chart;
}
function initChart2(canvas, width, height, dpr) {
  chart2 = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  })
  canvas.setChart(chart2);
  return chart2;
};
// 初始化图表函数  结束

Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
    certreProjectData: {},
    // echart初始化
    ec1: {
      onInit: initChart
    },
    ec2: {
      onInit: initChart2
    },
    pieData1: [],
    pieData2: [],
  },

  drawPie() {
    option = {
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: '收益明细',
          type: 'pie',
          radius: '50%',
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 0,
            borderColor: '#fff',
            borderWidth: 2
          },
          color: ['#C7E0FF', '#187FFF'],
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '10',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: this.data.pieData1,
        }
      ]
    };
    // 输出到页面
    setTimeout(() => {
      chart.setOption(option);
    }, 500);
  },

  drawPie2() {
    options = {
      tooltip: {
        trigger: 'item'
      },
      color: ['#C7E0FF', '#187FFF'],
      series: [
        {
          name: '收益明细',
          type: 'pie',
          radius: '50%',
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 0,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '10',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: this.data.pieData2,
        }
      ]
    };
    // 输出到页面
    setTimeout(() => {
      chart2.setOption(options);
    }, 500);
  },

  getDatas() {
    wx.showLoading({
      title: '加载中',
    });
    const that = this;
    fetch.get('/wx/project/projectStatics/getCenterBudgetProjectStaticWxVo').then(res => {
      wx.hideLoading();
      if(res.code == 200) {
        res.result.projectStartPercent = res.result.projectStartPercent.replace("%","") || 0;
        res.result.projectEndPercent = res.result.projectEndPercent.replace("%","") || 0;
        let pieData1 = [], pieData2 = [];
        pieData1.push({ value: res.result.totalInvest - res.result.investAccumulate, name: "项目未到位资金" });
        pieData1.push({ value: res.result.investAccumulate, name: "累计到位资金" });
        pieData2.push({ value: res.result.totalInvest - res.result.investAccumulateEnd, name: "项目未完成投资" });
        pieData2.push({ value: res.result.investAccumulateEnd, name: "累计完成投资" });
        this.setData({
          certreProjectData: res.result,
          pieData1: pieData1,
          pieData2: pieData2
        }, () => {
          that.drawPie();
          that.drawPie2();
        });
      };
    });
  },

  backlast() {
    //返回上一个页面
    wx.navigateBack();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getDatas();
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