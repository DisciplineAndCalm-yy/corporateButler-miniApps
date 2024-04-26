// pages/subPagesForLeader/pages/projectSpecial/projectSpecial.js
import { fetch, formatTime } from '../../../../utils/util.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
    specialData: {},
    list: []
  },

  getDatas() {
    wx.showLoading({
      title: '加载中',
    });
    fetch.get('/wx/project/projectStatics/getSpecialPurposeProjectStaticsWxVo').then(res => {
      wx.hideLoading();
      if(res.code == 200) {
        this.setData({
          specialData: res.result,
          list: res.result.proNameList
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