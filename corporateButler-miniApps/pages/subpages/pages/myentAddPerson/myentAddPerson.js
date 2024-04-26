// pages/subpages/pages/myentAddPerson/myentAddPerson.js
const app = getApp();
const { fetch } = require("../../../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
    entInfos: {},
    userInfo: {},
    isManager: true,
    personList: [],
    pageNo: 1,
    pageSize: 5,
    nomore: false,
    visible: false,
    addName: '',
    addPhonenum: '',
    hasRealName: true
  },

  getPersonList() {
    wx.showLoading({
      title: '加载中',
    });
    const that = this;
    const params = {
      entId: this.data.entId,
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize
    };
    fetch.get('/enterprise/entUser/list', params).then(res => {
      this.setData({
        personList: this.data.pageNo > 1 ? this.data.personList.concat(res.result.records) : res.result.records,
        nomore: res.result.current >= res.result.pages ? true : false
      }, () => {
        const users = that.data.personList.find(el => el.userId == that.data.userInfo.userId);
        that.setData({ isManager: users.adminPermission == 1 });
        wx.hideLoading();
      });
    });
  },

  // 弹出层
  onVisibleChange(e) {
    this.setData({
      visible: e.detail.visible
    });
  },

  fillName(e) {
    this.setData({
      addName: e.detail.value
    });
  },

  fillPhone(e) {
    this.setData({
      addPhonenum: e.detail.value
    }, () => {
      this.getRealName();
    });
  },

  checkPhone(str) {
    const reg = /^1[3456789]\d{9}$/;
    if(reg.test(str)) {
      return true;
    } else {
      return false;
    };
  },

  getRealName() {
    wx.showLoading({
      title: '加载中',
    });
    fetch.get('/sys/user/queryRealNameByPhone', { phone: this.data.addPhonenum }).then(res => {
      if(res.code == 200) {
        if(res.result == null) {
          this.setData({
            addName: '',
            hasRealName: false
          });
        } else {
          this.setData({
            addName: res.result,
            hasRealName: true
          });
        };
      } else {
        this.setData({
          addName: '',
          hasRealName: false
        });
      };
      wx.hideLoading();
    });
  },

  handleCencel() {
    this.setData({
      visible: false,
      addPhonenum: '',
      addName: '',
      hasRealName: true
    });
  },

  handleConfirm() {
    if(this.data.addPhonenum == '') {
      wx.showToast({
        title: '请输入手机号！',
        icon: 'none'
      });
      return
    };
    if(!this.checkPhone(this.data.addPhonenum)) {
      wx.showModal({
        title: '提示',
        content: '手机号格式不正确，请重新输入！',
        showCancel: false,
        confirmText: '确定',
        success (res) {}
      });
      this.setData({
        addPhonenum: '',
        addName: '',
        hasRealName: true
      });
      return
    };
    wx.showLoading({
      title: '加载中',
    });
    const params = {
      entId: this.data.entId,
      realname: this.data.addName,
      phone: this.data.addPhonenum
    };
    fetch.post('/enterprise/entUser/addEntUser', params).then(res => {
      if(res.code == 200) {
        wx.showToast({
          title: res.message
        });
        setTimeout(() => {
          this.setData({
            pageNo: 1,
            pageSize: 5,
            visible: false,
            addName: '',
            addPhonenum: '',
            hasRealName: true
          }, () => {
            this.getPersonList();
            wx.hideLoading();
          });
        }, 1000);
      };
    });
  },

  addMorePerson() {
    this.setData({
      visible: true
    });
  },

  deletePerson(e) {
    wx.showLoading({
      title: '加载中',
    });
    fetch.get('/enterprise/entUser/remove', { id: e.currentTarget.dataset.id }).then(res => {
      if(res.code == 200) {
        wx.showToast({
          title: res.message
        });
        setTimeout(() => {
          this.setData({
            pageNo: 1,
            pageSize: 5
          }, () => {
            this.getPersonList();
            wx.hideLoading();
          });
        }, 1000);
      };
    });
  },

  changeManager(e) {
    wx.showLoading({
      title: '加载中',
    });
    fetch.get('/enterprise/entUser/erect/administrator', { id: e.currentTarget.dataset.id }).then(res => {
      if(res.code == 200) {
        wx.showToast({
          title: res.message
        });
        setTimeout(() => {
          this.setData({
            pageNo: 1,
            pageSize: 5
          }, () => {
            this.getPersonList();
            wx.hideLoading();
          });
        }, 1000);
      };
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo,
      entId: options.entId ? options.entId : '',
      entInfos: options.entInfos ? JSON.parse(options.entInfos) : {}
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
    this.getPersonList();
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
    this.setData({
      personList: [],
      pageNo: 1,
      pageSize: 5
    }, ()=> {
      this.getPersonList();
    })
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if(this.data.nomore) return
    this.setData({
      pageNo: this.data.pageNo + 1
    }, () => {
      this.getPersonList();
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})