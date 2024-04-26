// pages/subPagesForEcharts/pages/publicResetPassword/publicResetPassword.js
import { fetch } from '../../../../utils/util.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuHeight: app.globalData.menuHeight,
    menuTop: app.globalData.menuTop,
    userInfo: {},
    showOldPwd: false,
    showPwd: false,
    showConfirmPwd: false,
    oldPwd: '',
    newPwd: '',
    confirmNewPwd: '',
    canSave: false
  },

  changeShow(e) {
    const n = e.currentTarget.dataset.index;
    this.setData({
      showOldPwd: n == '1' ? !this.data.showOldPwd : this.data.showOldPwd,
      showPwd: n == '2' ? !this.data.showPwd : this.data.showPwd,
      showConfirmPwd: n == '3' ? !this.data.showConfirmPwd : this.data.showConfirmPwd
    })
  },

  // blurPwd(e) {
  //   const n = e.currentTarget.dataset.index;
    // if(n != '1' && this.data.oldPwd == '') {
    //   wx.showToast({
    //     title: '请先输入旧密码！',
    //     icon: 'none'
    //   });
    //   return
    // };
    // if(n == '1') {
    //   this.setData({
    //     oldPwd: e.detail.value
    //   });
    // } else if(n == '2') {
    //   if(this.data.oldPwd == e.detail.value) {
    //     wx.showToast({
    //       title: '新密码不能与旧密码相同！',
    //       icon: 'none'
    //     });
    //     return
    //   };
    //   this.setData({
    //     newPwd: e.detail.value
    //   });
    // } else if(n == '3') {
    //   if(this.data.newPwd != e.detail.value) {
    //     wx.showToast({
    //       title: '两次新密码输入不一样！',
    //       icon: 'none'
    //     });
    //     return
    //   };
    //   this.setData({
    //     confirmNewPwd: e.detail.value
    //   });
    // };
  //   if(this.data.oldPwd != '' && this.data.newPwd != '' && this.data.confirmNewPwd != '') {
  //     this.setData({
  //       canSave: true
  //     });
  //   };
  // },

  inputPwd(e) {
    const n = e.currentTarget.dataset.index;
    if(n == '1') {
      this.setData({
        oldPwd: e.detail.value
      });
    } else if(n == '2') {
      this.setData({
        newPwd: e.detail.value
      });
    } else if(n == '3') {
      this.setData({
        confirmNewPwd: e.detail.value
      });
    };
    if(n != '1' && this.data.oldPwd == '') {
      wx.showToast({
        title: '请先输入旧密码！',
        icon: 'none'
      });
      return
    };
    if(this.data.oldPwd != '' && this.data.newPwd != '' && this.data.confirmNewPwd != '') {
      this.setData({
        canSave: true
      });
    };
  },

  toSavePwd() {
    if(this.data.oldPwd == this.data.newPwd || this.data.oldPwd == this.data.confirmNewPwd) {
      wx.showToast({
        title: '新密码不能与旧密码相同！',
        icon: 'none'
      });
      return
    };
    if(this.data.newPwd != this.data.confirmNewPwd) {
      wx.showToast({
        title: '两次新密码输入不一样！',
        icon: 'none'
      });
      return
    };
    wx.showLoading({
      title: '加载中',
    });
    const params = {
      oldpassword: this.data.oldPwd,
      password: this.data.newPwd,
      confirmpassword: this.data.confirmNewPwd,
      username: this.data.userInfo.username
    };
    fetch.put('/sys/user/updatePassword', params).then(res => {
      if(res.code == 200) {
        wx.showToast({
          title: res.message
        });
        setTimeout(() => {
          wx.hideLoading();
          wx.navigateBack();
        }, 1000);
      };
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const userinfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userinfo
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