// pages/accontLogin/accontLogin.js
import { fetch } from '../../utils/util.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    password: '',
    visible: false,
    roleValue: '1',
    isManager: false,
    isProjecter: false,
    isLeader: false
  },

  getLoginUserInfo() {
    fetch.get('/sys/user/currentUserinfo').then(res => {
      wx.hideToast();
      wx.setStorageSync('userInfo', res.result);
      const roleList = res.result.roleList;
      const isManager = roleList.findIndex(el => el.roleCode == 'enterprise_manager') != -1 ? true : false;
      const isProjecter = roleList.findIndex(el => el.roleCode == 'project_ director') != -1 ? true : false;
      const isLeader = roleList.findIndex(el => el.roleCode == 'enterprise_leader') != -1 ? true : false;
      this.setData({ isManager, isProjecter, isLeader });
      wx.hideLoading();
      if((isManager && isProjecter && isLeader) || (isManager && isProjecter) || (isManager && isLeader) || (isProjecter && isProjecter)) {
        this.setData({
          visible: true
        });
        return
      } else if(isManager && !isProjecter && !isLeader) {
        wx.showToast({
          title: '登录成功！',
          icon: 'none'
        });
        setTimeout(() => {
          wx.setStorageSync('role', '1');
          app.globalData.subTabIndex = 0;
          wx.redirectTo({
            url: '/pages/subPagesForEcharts/pages/homeSteward/homeSteward',
          })
        }, 1000);
        return
      } else if(isProjecter && !isManager && !isLeader) {
        wx.showToast({
          title: '登录成功！',
          icon: 'none'
        });
        setTimeout(() => {
          wx.setStorageSync('role', '2');
          app.globalData.subTabIndex = 0;
          wx.redirectTo({
            url: '/pages/subPagesForEcharts/pages/homeProjectmanager/homeProjectmanager',
          })
        }, 1000);
        return
      } else if(isLeader && !isManager && !isProjecter) {
        wx.showToast({
          title: '登录成功！',
          icon: 'none'
        });
        setTimeout(() => {
          wx.setStorageSync('role', '3');
          app.globalData.leaderTabIndex = 0;
          wx.redirectTo({
            url: '/pages/subPagesForLeader/pages/homeLeader/homeLeader',
          })
        }, 1000);
        return
      };
    });
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

  },

  // 弹出层
  onVisibleChange(e) {
    this.setData({
      visible: e.detail.visible
    });
  },

  onChangeRoleValue(e) {
    this.setData({
      roleValue: e.detail.value
    });
  },

  confirmRole() {
    let roleId = this.data.roleValue;
    wx.showToast({
      title: '登录成功！',
      icon: 'none'
    });
    setTimeout(() => {
      if(roleId == '1') {
        wx.setStorageSync('role', '1');
        app.globalData.subTabIndex = 0;
        wx.redirectTo({
          url: '/pages/subPagesForEcharts/pages/homeSteward/homeSteward',
        })
        return
      };
      if(roleId == '2') {
        wx.setStorageSync('role', '2');
        app.globalData.subTabIndex = 0;
        wx.redirectTo({
          url: '/pages/subPagesForEcharts/pages/homeProjectmanager/homeProjectmanager',
        })
        return
      };
      if(roleId == '3') {
        wx.setStorageSync('role', '3');
        app.globalData.leaderTabIndex = 0;
        wx.redirectTo({
          url: '/pages/subPagesForLeader/pages/homeLeader/homeLeader',
        })
        return
      };
    }, 1000);
  },

  usernameInput:function(e){
    this.setData({
      username: e.detail.value
    });
  },
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    });
  },

  handleLogin: function(e) {
    if(this.data.username == '') {
      wx.showToast({
        title: '请输入账号！',
        icon: 'none'
      });
      return
    };
    if(this.data.password == '') {
      wx.showToast({
        title: '请输入密码！',
        icon: 'none'
      });
      return
    };
    wx.removeStorageSync('role');
    wx.showLoading({
      title: '登录中，请稍后',
    });
    wx.login({
      success: (res) => {
        if(res.code) {
          fetch.post('/wechat/minapp/login/account', {
            jsCode: res.code,
            username: this.data.username,
            password: this.data.password
          }).then(data => {
            wx.hideLoading();
            if(data.code !== 200) {
              wx.showToast({
                title: data.message,
                icon: 'none',
                duration: 3000
              });
              return;
            };
            wx.removeStorageSync('token');
            wx.setStorageSync('token', data.result);
            this.getLoginUserInfo();
          });
        };
      },
    });
  }
})