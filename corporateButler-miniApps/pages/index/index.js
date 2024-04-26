// index.js
import { fetch } from '../../utils/util.js';
// 获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    navBarHeight: app.globalData.navBarHeight,
    menuRight: app.globalData.menuRight,
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
    isRead: false,
    isStop: false
  },

  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      });
    };
    wx.setStorageSync('entInfo', null);
  },

  onCheckChange(e) {
    this.setData({
      isRead: !e.currentTarget.dataset.value
    });
  },

  toAgreement() {
    wx.navigateTo({
      url: '/pages/subpages/pages/agreement/agreement'
    });
  },

  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
      }
    });
  },

  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
  },

  toAgreeAgreement() {
    if(!this.data.isRead) {
      wx.showToast({
        title: '请阅读并勾选用户协议',
        icon: 'none'
      });
      return
    };
  },

  //绑定手机
  getPhoneNumber: function (e) {
    if(!e.detail.code) return;
    fetch.get('/wechat/minapp/getPhoneNumber', {
      jsCode: e.detail.code ? e.detail.code : ''
    }).then(resolve => {
      if(resolve.success) {
        wx.login({
          success: (res) => {
            if(res.code) {
              fetch.post('/wechat/minapp/login/phone', {
                phoneNumber: resolve.result ? resolve.result : '',
                jsCode: res.code
              }).then(data => {
                wx.removeStorageSync('token');
                wx.showLoading({
                  title: '登录中，请稍后',
                });
                wx.setStorageSync('token', data.result);
                this.getLoginUserInfo();
              });
            };
          },
        });
      } else {
        wx.showModal({
          title: "错误",
          content: resolve.message,
          showCancel: false,
          confirmText: "确定"
        });
      };
    });
  },

  getLoginUserInfo() {
    fetch.get('/sys/user/currentUserinfo').then(res => {
      wx.setStorageSync('userInfo', res.result);
      app.globalData.showSubscribe = true;
      wx.removeStorageSync('role');
      wx.setStorageSync('role', '0');
      this.getEnterpriseInfo();
    })
  },

  getEnterpriseInfo() {
    fetch.get('/enterprise/entUser/queryEntInfo').then(res => {
      if(res.code == 200) {
        this.setData({
          entInfo: res.result
        });
        wx.setStorageSync('entInfo', res.result);
        wx.showToast({
          title: '登录成功！',
          icon: 'none'
        });
        setTimeout(() => {
          wx.hideLoading();
          // if(res.result == null) {
          //   wx.switchTab({
          //     url: '/pages/mine/mine',
          //   });
          // } else {
            wx.switchTab({
              url: '/pages/home/home',
            });
          // };
        }, 1000);
      } else {
        wx.hideLoading();
      };
    });
  },

  toAccontLogin: function(e) {
    if(!this.data.isRead) {
      wx.showToast({
        title: '请阅读并勾选用户协议',
        icon: 'none'
      });
      return
    };
    wx.navigateTo({
      url: '/pages/accontLogin/accontLogin',
    })
  }
})
