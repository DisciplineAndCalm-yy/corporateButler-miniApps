// pages/subpages/pages/unbindList/unbindList.js
const app = getApp();
const { fetch, baseUrl } = require("../../../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
    unbindData: [],
    pageNo: 1,
    pageSize: 5,
    nomore: false,
    statusMap: {
      1: {
        class: 'pending_unbind',
        label: '办理中'
      },
      2: {
        class: 'success_unbind',
        label: '已解绑'
      },
      3: {
        class: 'faild_unbind',
        label: '不予解绑'
      }
    },
    visible: false,
    isExpend: false,
    unbindInfo: {},
    isShare: false
  },

  // 打开遮罩层
  handleShow(e) {
    this.setData({
      visible: true,
      isExpend: false,
      unbindInfo: {}
    }, () => {
      this.getDetails(e.currentTarget.dataset.id);
    });
  },

  // 关闭遮罩层
  handleClose() {
    this.setData({
      visible: false
    });
  },

  // 弹出层
  onVisibleChange(e) {
    this.setData({
      visible: e.detail.visible
    });
  },

  changeExpend() {
    const expend = !this.data.isExpend;
    this.setData({
      isExpend: expend
    });
  },

  // 预览图片
  previewImg: function (e) {
    let imgs = this.data.unbindInfo.sourceLink;
    let fileList = [];
    fileList.push(imgs);
    wx.previewImage({
      //当前显示图片
      current: imgs,
      //所有图片
      urls: fileList
    });
  },

  getUnbindData() {
    wx.showLoading({
      title: '加载中',
    });
    const params = {
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize
    };
    fetch.get('/enterprise/entUnbindApply/queryUnbindApplyProgress', params).then(res => {
      this.setData({
        unbindData: this.data.pageNo > 1 ? this.data.unbindData.concat(res.result.records) : res.result.records,
        nomore: res.result.current >= res.result.pages ? true : false
      }, () => {
        wx.hideLoading();
      });
    });
  },

  getDetails(id) {
    wx.showLoading({
      title: '加载中',
    });
    fetch.get('/enterprise/entUnbindApply/queryUnbindApplyApprove', { id }).then(res => {
      let infos = res.result;
      fetch.get('/sys/common/getTemporaryPath', { filePath: res.result.licenseFile }).then(data => {
        let sourceLink = baseUrl.replace('/jeecgboot', '') + data.result;
        infos.sourceLink = sourceLink;
        this.setData({
          unbindInfo: infos
        }, () => {
          wx.hideLoading();
        });
      });
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      isShare: options.isShare ? JSON.parse(options.isShare) : false,
      unbindData: [],
      pageNo: 1,
      pageSize: 5
    });

    this.getUnbindData();
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
    this.setData({
      unbindData: [],
      pageNo: 1,
      pageSize: 5
    }, ()=> {
      this.getUnbindData();
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
      this.getUnbindData();
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})