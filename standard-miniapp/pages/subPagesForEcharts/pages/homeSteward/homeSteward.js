// pages/subPagesForEcharts/pages/homeSteward/homeSteward.js
import { fetch } from '../../../../utils/util.js';
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
  canvas.setChart(chart)
  return chart;
}
function initChart2(canvas, width, height, dpr) {
  chart2 = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  })
  canvas.setChart(chart2)
  return chart2;
}
// 初始化图表函数  结束
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuHeight: app.globalData.menuHeight,
    menuTop: app.globalData.menuTop,
    appealEntList: [],
    appealWarning: [],
    // echart初始化
    begec: {
      onInit: initChart
    },
    moneyec: {
      onInit: initChart2
    },
    begChartsData: {
      xData: [],
      yData: []
    },
    moneyChartsData: {
      xData: [],
      yData: []
    },
    projectNameIndex: 0,
    projectNameList: [],
    projectList: [],
    userInfo: {},
    rectTop: 0,
    clockInfo: {
      entNum: 0,
      monthRecordNum: 0,
      recordNum: 0,
      todayRecordNum: 0,
      weekRecordNum: 0
    }
  },

  getClockData() {
    wx.showLoading({
      title: '加载中',
    });
    fetch.get('/enterprise/entMangerRecord/currentUser/report').then(res => {
      if(res.code == 200) {
        this.setData({
          clockInfo: res.result
        }, () => {
          wx.hideLoading();
        });
      };
    });
  },

  // 企业打卡
  toClock() {
    wx.navigateTo({
      url: '/pages/subPagesForEcharts/pages/clockIn/clockIn',
    });
  },

  toClockRecord() {
    wx.navigateTo({
      url: '/pages/subPagesForEcharts/pages/clockRecord/clockRecord',
    });
  },

  getAppealEntList() {
    wx.showLoading({
      title: '加载中',
    });
    fetch.get('/qixian/manger/queryEnterpriseAppeal').then(res => {
      if(res.code == 200) {
        this.setData({
          appealEntList: res.result
        }, () => {
          wx.hideLoading();
        });
      };
    });
  },

  getAppealWarn() {
    wx.showLoading({
      title: '加载中',
    });
    fetch.get('/qixian/manger/appealWarningSeven').then(res => {
      if(res.code == 200) {
        this.setData({
          appealWarning: res.result
        }, () => {
          wx.hideLoading();
        });
      };
    });
  },

  getAppealChartData() {
    wx.showLoading({
      title: '加载中',
    });
    const date = new Date();
    const years = date.getFullYear();
    fetch.get('/qixian/manger/mangerAppealMonth?year=' + years).then(res => {
      if(res.code == 200) {
        let obj = {
          xData: [],
          yData: []
        };
        res.result.map(el => {
          obj.xData.push(el.name);
          obj.yData.push(el.value);
        });
        this.setData({
          begChartsData: obj
        }, () => {
          wx.hideLoading();
          this.fun();
        });
      };
    });
  },

  toEntBeg(e) {
    wx.navigateTo({
      url: '/pages/subpages/pages/appeal/appeal?entId=' + e.currentTarget.dataset.id
    });
  },

  toOverDateBeg(e) {
    wx.navigateTo({
      url: '/pages/subpages/pages/appeal/appeal?warningDay=' + e.currentTarget.dataset.date
    });
  },

  fun() {
    option = {
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        textStyle: {
            color: '#000'
        }
      },
      grid: {
        left: "12%",
        right: "0%"
      },
      xAxis: {
        type: 'category',
        data: this.data.begChartsData.xData,
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
          type: 'value',
          scale: true,
          minInterval: 1,
          axisLabel: {
            color: "rgba(189, 196, 207, 1)",
            interval: 0,
            rotate: 0
          },
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
      series: [
        {
          label: { //数据显示
            show: true,
            color:'inherit',
            position:'top',
            fontSize: 10,
          },
          legend: {
            z: 1
          },
          lineStyle: {
            color: '#007dff'
          },
          symbol: 'circle',
          areaStyle: {
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                    {
                        offset: 0,
                        color: 'rgba(24, 127, 255, .6)'
                    },
                    {
                        offset: 0.5,
                        color: 'rgba(24, 127, 255, .2)'
                    },
                    {
                        offset: 1,
                        color: 'rgba(255, 255, 255, 0)'
                    }
                ],
                global: false
            }
          },
          data: this.data.begChartsData.yData,
          showSymbol: false,
          smooth: 0.5,
          type: 'line'
        }
      ]
    }
    // 输出到页面
    setTimeout(() => {
      chart.setOption(option);
    }, 500);
  },

  func() {
    let arr = [23, 24, 25, 26, 27, 28, 29];  //  X轴假数据
    let datas = [773, 768, 865, 937, 148, 487, 410];  // Y轴假数据
    options = {
      grid: {
        left: "12%",
        right: "0%"
      },
      xAxis: {
        type: 'category',
        data: arr,
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
        type: 'value',
        axisLabel: {
          color: "rgba(189, 196, 207, 1)",
          interval: 0,
          rotate: 0
        },
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
        data: datas,
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
      chart2.setOption(options);
    }, 500);
  },

  bindPickerChange(e) {
    console.log('picker值为', e.detail.value);
    this.setData({
      projectNameIndex: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    let that = this;
    //获取元素节点的位置信息
    const query = wx.createSelectorQuery().in(this);
    //小程序BUG不加延时算出来的高度部分机型不准确，目前官方没有给更好的解决方案
    setTimeout(() => { 
      query.select('.checkline').boundingClientRect(res => {
        that.setData({
          rectTop: res.top
        });
      }).exec();
    }, 0);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getClockData();
    this.getAppealEntList();
    this.getAppealWarn();
    this.getAppealChartData();
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