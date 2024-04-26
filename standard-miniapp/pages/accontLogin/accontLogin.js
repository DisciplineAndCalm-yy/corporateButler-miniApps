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
    roleValue: '1'
  },

  getLoginUserInfo() {
    fetch.get('/sys/user/currentUserinfo').then(res => {
      wx.hideToast();
      wx.setStorageSync('userInfo', res.result);
      const roleList = res.result.roleList;
      const isManager = roleList.findIndex(el => el.roleCode == 'enterprise_manager');
      const isProjecter = roleList.findIndex(el => el.roleCode == 'project_ director');
      const isUser = roleList.findIndex(el => el.roleCode == 'enterprise_user');
      const isLeader = roleList.findIndex(el => el.roleCode == 'enterprise_leader');
      wx.showToast({
        title: '登录成功！',
        icon: 'none'
      });
      setTimeout(() => {
        wx.hideLoading();
        if(isUser != -1) {
          this.getUserlogin();
          return
        };
        if(isLeader != -1) {
          wx.setStorageSync('role', '3');
          app.globalData.leaderTabIndex = 0;
          wx.redirectTo({
            url: '/pages/subPagesForLeader/pages/homeLeader/homeLeader',
          })
          return
        };
        if(isManager != -1 && isProjecter != -1) {
          this.setData({
            visible: true
          });
          return
        } else if(isManager != -1 && isProjecter == -1) {
          wx.setStorageSync('role', '1');
          app.globalData.subTabIndex = 0;
          wx.redirectTo({
            url: '/pages/subPagesForEcharts/pages/homeSteward/homeSteward',
          })
          return
        } else if(isManager == -1 && isProjecter != -1) {
          // wx.showToast({
          //   title: '负责人部分尚未完善，待上线',
          //   icon: 'none'
          // });
          // return
          wx.setStorageSync('role', '2');
          app.globalData.subTabIndex = 0;
          wx.redirectTo({
            url: '/pages/subPagesForEcharts/pages/homeProjectmanager/homeProjectmanager',
          })
          return
        };
      }, 1000);
    });
  },

  getUserlogin() {
    app.globalData.showSubscribe = true;
    wx.removeStorageSync('role');
    wx.setStorageSync('role', '0');
    this.getEnterpriseInfo();
  },

  getEnterpriseInfo() {
    fetch.get('/enterprise/entUser/queryEntInfo').then(res => {
      this.setData({
        entInfo: res.result
      });
      wx.setStorageSync('entInfo', res.result);
      setTimeout(() => {
        wx.hideLoading();
        wx.switchTab({
          url: '/pages/home/home',
        });
      }, 1000);
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
            if(data.code == 500) {
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