// pages/subPagesForEcharts/pages/homeProjectmanager/homeProjectmanager.js
import { fetch } from '../../../../utils/util.js';
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
  })
  canvas.setChart(chart)
  return chart;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuHeight: app.globalData.menuHeight,
    menuTop: app.globalData.menuTop,
    projectInfo: {},
    dataDate: '',
    moneyec: {
      onInit: initChart
    },
    moneyChartsData: {
      xData: [],
      yData: []
    },
    projectNameIndex: 0,
    projectNameList: [],
    projectList: [],
    projectIdMap: {}
  },

  getProjectInfo() {
    fetch.get('/wx/project/projectInfo/indexStatistics').then(res => {
      if(res.code == 200) {
        let projectInfos = res.result;
        projectInfos.curyearPlanTotalInvestment = Math.round(projectInfos.curyearPlanTotalInvestment/100)/100 || 0;
        projectInfos.curyearTotalInvestment = Math.round(projectInfos.curyearTotalInvestment/100)/100 || 0;
        this.setData({
          projectInfo: projectInfos
        });
      };
    });
  },

  getProjectList() {
    fetch.get('/wx/project/projectInfo/listProjectInfo').then(res => {
      if(res.code == 200) {
        this.setData({
          projectList: res.result,
          projectIdMap: this.dealItemsMap(res.result),
          projectNameList: res.result.map(el => { return el.proName })
        }, () => {
          this.getProjectData();
        });
      };
    });
  },

  getProjectData() {
    const proId = this.data.projectIdMap[this.data.projectNameList[this.data.projectNameIndex]];
    fetch.get('/wx/project/projectInfo/indexProjectStatistics', { id: proId }).then(res => {
      if(res.code == 200) {
        let obj = {
          xData: [],
          yData: []
        };
        res.result.map(el => {
          obj.xData.push(el.monthStr);
          obj.yData.push(Math.round(el.curMonthTotalInvest/10000));
        });
        this.setData({
          moneyChartsData: obj
        }, () => {
          this.func();
        });
      };
    });
  },

  bindPickerChange(e) {
    this.setData({
      projectNameIndex: e.detail.value
    }, () => {
      this.getProjectData();
    });
  },

  // 处理map映射关系
  dealItemsMap(data) {
    let mapObj = {};
    data.map(el => {
      mapObj[el.proName] = el.id;
    });
    return mapObj;
  },

  func() {
    option = {
      grid: {
        left: "12%",
        right: "0%"
      },
      xAxis: {
        type: 'category',
        data: this.data.moneyChartsData.xData,
        axisLine: {
          lineStyle: {
            color: "rgba(225, 231, 237, 1)"
          },
          show: true
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: "rgba(189, 196, 207, 1)",
          interval: 0,
          rotate: 0
        }
      },
      yAxis: {
        name: "单位(亿元)",
        nameTextStyle: {
          color: "rgba(189, 196, 207, 1)"
        },
        type: 'value',
        axisLabel: {
          color: "rgba(189, 196, 207, 1)",
          interval: 0,
          rotate: 0
        },
        minInterval: 1,
        min: 1,
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        splitLine: {
          lineStyle: {
            type: "dashed",
            color: 'rgba(245, 245, 245, 1)'
          }
        }
      },
      series: [{
        data: this.data.moneyChartsData.yData,
        type: 'bar',
        itemStyle: {
          color: "rgba(12, 119, 251, 1)",
          borderRadius: [10, 10, 10, 10]
        },
        legend: {
          z: 1
        },
        barWidth: "25%"
      }]
    }
    // 输出到页面
    setTimeout(() => {
      chart.setOption(option);
    }, 500);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
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
    this.getProjectInfo();
    this.getProjectList();

    const date = new Date();
    let str = '';
    str = date.getFullYear() + '年' + (date.getMonth()+1) + '月' + date.getDate() + '日';
    this.setData({
      dataDate: str
    });
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