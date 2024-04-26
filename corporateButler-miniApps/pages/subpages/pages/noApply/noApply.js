// pages/subpages/pages/noApply/noApply.js
const app = getApp();
const { fetch, baseUrl } = require("../../../../utils/util");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
    noApplyList: [],
    pageNo: 1,
    pageSize: 20,
    nomore: false,
  },

  getList() {
    wx.showLoading({
      title: '加载中',
    });
    const params = {
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize
    };
    fetch.get('/policy/enjoy/file/list', params).then(res => {
      let arr = res.result.records;
      if(arr.length > 0) {
        arr.forEach(el => {
          el.sourceLink = baseUrl.replace('/jeecgboot', '') + el.policyAttachment
        });
        this.setData({
          noApplyList: this.data.pageNo > 1 ? this.data.noApplyList.concat(arr) : arr,
          nomore: res.result.current >= res.result.pages ? true : false
        }, () => {
          wx.hideLoading();
        });
      } else {
        this.setData({
          nomore: res.result.current >= res.result.pages ? true : false
        }, () => {
          wx.hideLoading();
        });
      };
    });
  },

  //  文档预览
  previewDoc(event) {
    // 拿到文件的地址url
    let currentUrl = event.currentTarget.dataset.src;
    if(currentUrl == '') return
    let fileType = null, file = null;
    const str = currentUrl.split('policyEnjoyFile/')[1];
    const index = str.lastIndexOf("\?");
    file = str.substring(0, index);
    if(file.endsWith('.doc')) {
      fileType = 'doc';
    } else if(file.endsWith('.docx')) {
      fileType = 'docx';
    } else if(file.endsWith('.xls')) {
      fileType = 'xls';
    } else if(file.endsWith('.xlsx')) {
      fileType = 'xlsx';
    } else if(file.endsWith('.ppt')) {
      fileType = 'ppt';
    } else if(file.endsWith('.pptx')) {
      fileType = 'pptx';
    } else if(file.endsWith('.pdf')) {
      fileType = 'pdf';
    };
    wx.showLoading({
      title: '加载中',
    });
    if(fileType) {
      wx.downloadFile({
        url: currentUrl,
        success: function (res) {
          wx.hideLoading();
          const filePath = res.tempFilePath
          wx.openDocument({
            filePath: filePath,
            fileType,
            showMenu: true,
            success: function (res) {
            }
          });
        }
      });
    } else {
      wx.previewMedia({
        sources:[{ type:"image", url: currentUrl }]
      });
    };
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      noApplyList: [],
      pageNo: 1,
      pageSize: 20
    });

    this.getList();
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
      noApplyList: [],
      pageNo: 1,
      pageSize: 20
    }, ()=> {
      this.getList();
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
      this.getList();
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})