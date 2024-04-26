// pages/subpages/pages/unbindEnt/unbindEnt.js
const app = getApp();
const { fetch } = require("../../../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
    entCode: '',
    name: '',
    phone: '',
    fileList: [],
    confirmFileList: [],
    canSubmit: true
  },

  inputName(e) {
    this.setData({
      name: e.detail.value
    });
  },

  inputPhone(e) {
    this.setData({
      phone: e.detail.value
    });
  },

  // 上传图片
  chooseImg: function (e) {
    let that = this;
    let fileList = this.data.fileList;
    if (fileList.length >= 1) {
      wx.showToast({
        icon: 'error',
        title: '最多上传一张图片'
      });
      return
    };
    wx.chooseMedia({
      // count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        fetch.upload('/sys/common/upload', res.tempFiles[0].tempFilePath, { biz: 'temp' }).then(resolve => {
          console.log('resolve', resolve);
          if(resolve.code == 200) {
            let pathList = [];
            pathList.push({ path: resolve.result.path });
            wx.showToast({
              title: resolve.message,
              icon: 'none'
            });
            that.setData({
              confirmFileList: pathList
            });
          };
        });
        let fileList = that.data.fileList;
        for(let i = 0; i < res.tempFiles.length; i++) {
          if (fileList.length >= 9) {
            that.setData({
              fileList: fileList
            });
            return false;
          } else {
            fileList.push(res.tempFiles[i].tempFilePath);
          }
        };
        that.setData({
          fileList: fileList
        });
      }
    });
  },

  // 删除图片
  deleteImg: function (e) {
    let fileList = this.data.fileList;
    let confirmFileList = this.data.confirmFileList;
    let index = e.currentTarget.dataset.index;
    fileList.splice(index, 1);
    confirmFileList.splice(index, 1);
    this.setData({
      fileList,
      confirmFileList
    });
  },

  // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
    let index = e.currentTarget.dataset.index;
    //所有图片
    let fileList = this.data.fileList;
    wx.previewImage({
      //当前显示图片
      current: fileList[index],
      //所有图片
      urls: fileList
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

  checkForm() {
    if(this.data.name == '') {
      wx.showToast({
        title: '请输入联系人！',
        icon: 'none'
      });
      return false;
    };
    if(this.data.phone == '') {
      wx.showToast({
        title: '请输入联系电话！',
        icon: 'none'
      });
      return false;
    };
    if(this.data.confirmFileList.length == 0) {
      wx.showToast({
        title: '请上传营业执照！',
        icon: 'none'
      });
      return false;
    };
    if(!this.checkPhone(this.data.phone)) {
      wx.showToast({
        title: '手机号格式不正确，请重新输入！',
        icon: 'none'
      });
      this.setData({
        phone: ''
      });
      return false;
    };
    this.setData({
      canSubmit: false
    });
    return true;
  },

  submitUnbind() {
    if(!this.checkForm()) return;
    const params = {
      creditCode: this.data.entCode,
      name: this.data.name,
      phone: this.data.phone,
      licenseFile: this.data.confirmFileList[0].path
    };
    fetch.post('/enterprise/entUnbindApply/add', params).then(res => {
      if(res.code == 200) {
        wx.showToast({
          title: res.message,
          icon: 'none'
        });
        this.setData({
          canSubmit: true
        }, () => {
          const that = this;
          wx.showModal({
            title: '提示',
            content: '是否订阅解绑消息提醒？',
            complete: (res) => {
              if(res.cancel) {
                setTimeout(() => {
                  wx.redirectTo({
                    url: '/pages/subpages/pages/unbindList/unbindList'
                  });
                }, 500);
              };
              if(res.confirm) {
                wx.requestSubscribeMessage({
                  tmplIds: ['ufAsSvmFofcCEIWTZInKAez-qjrLZ3oYmPtZmuGjlU0'],
                  success(res) {
                    wx.showToast({
                      title: '订阅成功！',
                      icon: 'success'
                    });
                    that.setData({
                      showSubscribe: false
                    }, () => {
                      setTimeout(() => {
                        wx.redirectTo({
                          url: '/pages/subpages/pages/unbindList/unbindList'
                        });
                      }, 1500);
                    });
                  },
                  error(err) {
                    wx.showToast({
                      title: '授权出现错误',
                      icon: 'none'
                    });
                  }
                });
              };
            }
          });
        });
      } else {
        wx.hideToast();
        this.setData({
          canSubmit: false
        });
        wx.showModal({
          title: '提示',
          content: res.message,
          showCancel: false,
          complete: (res) => {
            if (res.cancel) {
            }
            if (res.confirm) {
              wx.redirectTo({
                url: '/pages/subpages/pages/unbindList/unbindList?isShare=true'
              });
            };
          }
        });
      };
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      entCode: options.entCode ? options.entCode : ''
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