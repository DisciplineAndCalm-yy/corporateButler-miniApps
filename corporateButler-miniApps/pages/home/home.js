// pages/home/home.js

const { fetch } = require("../../utils/util");

// 获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navBarHeight: app.globalData.navBarHeight,
    menuRight: app.globalData.menuRight,
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
    list: [],
    index: 5,
    nomore: false,
    entInfo: {
      entName: '',
      creditCode: '',
    },
    showOverlay: false,
    visible: false
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
    const role = wx.getStorageSync('role')
    if(role == 1) {
      this.setData({
        showOverlay: true
      }, () => {
        wx.navigateTo({
          url: '/pages/subPagesForEcharts/pages/homeSteward/homeSteward',
        });
      });
    } else if(role == 2) {
      this.setData({
        showOverlay: true
      }, () => {
        wx.navigateTo({
          url: '/pages/subPagesForEcharts/pages/homeProjectmanager/homeProjectmanager',
        });
      });
    } else {
      this.getData();
      const entInfos = wx.getStorageSync('entInfo');
      this.setData({
        entInfo: entInfos,
        showOverlay: false
      });
    };
    if(typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      });
    };
  },

  showMoreEntName() {
    this.setData({
      visible: true
    });
  },

  closeShowmore() {
    this.setData({
      visible: false
    });
  },
  
  getEntUserInfo() {
    fetch.get('/sys/user/currentUserinfo').then(res => {
      wx.setStorageSync('userInfo', res.result);
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
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
  },

  getData() {
    wx.showLoading({
      title: '加载中',
    });
    const data = {
      visitSource: 0, //  0-小程序，1-pc
      policyClassify: '0,1',
      pageNo: 1,
      pageSize: 20
    };
    fetch.get('/policy/base/manualCollectPolicyList', data).then(res => {
      this.setData({
        list: res.result.records,
        nomore: true
      }, () => {
        wx.hideLoading();
      });
    });
  },

  toAddEnt() {
    wx.switchTab({
      url: '/pages/mine/mine',
    });
  },

  toNoApply() {
    wx.navigateTo({
      url: '/pages/subpages/pages/noApply/noApply'
    });
  },

  toPolicyStore() {
    wx.switchTab({
      url: '/pages/policyStore/policyStore',
    });
  },

  toMessage() {
    wx.navigateTo({
      url: '/pages/subpages/pages/policyStoreMessage/policyStoreMessage',
    })
  },

  // 疑难解答
  handleTroubleshoot() {
    // wx.showToast({
    //   title: '功能尚未完善，待上线',
    //   icon: 'none'
    // });
    // return
    if(this.data.entInfo == null) {
      wx.showToast({
        title: '暂未绑定，请先绑定企业~',
        icon: 'none'
      });
      return
    };
    wx.navigateTo({
      url: '/pages/subpages/pages/answer/answer',
    })
  },

  // 诉求反馈
  handleQuestionFeedback() {
    // wx.showToast({
    //   title: '功能尚未完善，待上线',
    //   icon: 'none'
    // });
    // return
    if(this.data.entInfo == null) {
      wx.showToast({
        title: '暂未绑定，请先绑定企业~',
        icon: 'none'
      });
      return
    };
    wx.navigateTo({
      url: '/pages/subpages/pages/question/question',
    })
  },

  toMatchDetail(e) {
    wx.navigateTo({
      url: '/pages/subpages/pages/policyMatchDetail/policyMatchDetail?isMatch=false&notStore=false&policyId=' + e.currentTarget.dataset.policyid,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})