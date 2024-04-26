// pages/mine/mine.js
const app = getApp();
import { fetch } from '../../utils/util';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
    hasEnt: false,
    hasSteward: false,
    mangerVoList: [],
    changeEntList: [],
    changeEntvalue: '',
    entInfo: {},
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    visible: false,
    value: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(options && options.hasEnt) {
      this.setData({
        hasEnt: options.hasEnt ? JSON.parse(options.hasEnt) : false
      });
    };
    if(wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      });
    };
  },
  
  onChange(e) {
    this.setData({
      visible: false,
      changeEntvalue: e.detail.value
    }, () => {
      //  切换企业打开订阅消息
      app.globalData.showSubscribe = true;
      let ent = this.data.changeEntList.filter(el => el.id == e.detail.value)[0];
      wx.setStorageSync('entInfo', ent);
      this.onShow();
    });
  },

  onVisibleChange() {
    this.setData({
      visible: false
    });
  },

  // 添加企业
  toAddEnt() {
    wx.navigateTo({
      url: '/pages/subpages/pages/completeEnterprise/completeEnterprise?isMine=true',
    });
  },

  // 查看解绑进度
  toUnbind() {
    wx.navigateTo({
      url: '/pages/subpages/pages/unbindList/unbindList'
    });
  },

  // 切换企业
  toChangeEnt() {
    this.setData({
      visible: true
    }, () => {
      this.getCanChangeEntList();
    });
  },

  // 设置标签
  toSettingTags() {
    wx.navigateTo({
      url: '/pages/subpages/pages/settingTags/settingTags',
    });
  },

  // 退出登录
  toLoginOut() {
    wx.showToast({
      title: '退出成功！',
      icon: 'none'
    });
    setTimeout(() => {
      wx.reLaunch({
        url: '/pages/index/index'
      });
    }, 1000);
  },

  // 申请管家
  toApplySteward() {
    fetch.get('/enterprise/entMangerApply/mangerApply', { entId: this.data.entInfo.id }).then(res => {
      if(res.code == 200) {
        wx.showToast({
          title: '申请成功！'
        });
        this.getStewardData();
      };
    })
  },

  // 我的企业
  toMyEnterprise() {
    wx.navigateTo({
      url: '/pages/subpages/pages/myEnterprise/myEnterprise',
    });
  },

  // 疑难解答
  toQuestion() {
    // wx.showToast({
    //   title: '功能尚未完善，待上线',
    //   icon: 'none'
    // });
    // return
    wx.navigateTo({
      url: '/pages/subpages/pages/orders/orders',
    });
  },
  
  // 我的收藏
  toMyCollects() {
    wx.navigateTo({
      url: '/pages/subpages/pages/myCollect/myCollect',
    });
  },

  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },

  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  getStewardData() {
    fetch.get('/enterprise/entUser/mangerAndApplyPermit', { entId: this.data.entInfo.id }).then(res => {
      if(res.code == 200) {
        this.setData({
          hasSteward: !res.result.apply,
          mangerVoList: res.result.mangerVoList
        });
      };
    })
  },

  getCanChangeEntList() {
    fetch.get('/enterprise/entUser/queryEntInfoList').then(res => {
      if(res.code == 200) {
        this.setData({
          changeEntList: res.result
        });
      };
    });
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
    if(typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 4
      });
    };
    if(wx.getStorageSync('entInfo') != null) {
      this.setData({
        hasEnt: true,
        entInfo: wx.getStorageSync('entInfo') || {},
        changeEntvalue: wx.getStorageSync('entInfo').id
      }, () => {
        this.getStewardData();
      });
    } else {
      this.setData({
        hasEnt: false
      });
    };
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