// pages/subPagesForEcharts/pages/projectInterview/projectInterview.js
import { fetch, baseUrl } from '../../../../utils/util.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuHeight: app.globalData.menuHeight,
    menuTop: app.globalData.menuTop,
    projectId: '',
    projectInfo: {},
    interviewId: null,
    interviewInfo: {},
    interviewDesc: '',
    interviewDate: '',
    fileList: [],
    confirmFileList: [],
    canNotSave: false
  },

  getProjectData() {
    wx.showLoading({
      title: '加载中',
    });
    fetch.get('/project/projectInfo/queryById', { id: this.data.projectId }).then(res => {
      this.setData({
        projectInfo: res.result
      }, () => {
        wx.hideLoading();
      });
    });
  },

  getProviewDetail() {
    wx.showLoading({
      title: '加载中',
    });
    fetch.get('/project/projectInterviewRecords/listById', { id: this.data.interviewId }).then(res => {
      if(res.code == 200) {
        let tmpList = [];
        if(res.result.pathList != null) {
          res.result.pathList.map(el => {
            tmpList.push(baseUrl.replace('/jeecgboot', '') + el.tempPath);
          });
        };
        this.setData({
          interviewInfo: res.result,
          interviewDesc: res.result.itemDescription,
          interviewDate: res.result.interviewDate,
          fileList: tmpList,
          confirmFileList: res.result.pathList ? res.result.pathList : []
        }, () => {
          wx.hideLoading();
        });
      };
    });
  },

  toRecord(e) {
    wx.navigateTo({
      url: '/pages/subPagesForEcharts/pages/projectInterviewRecord/projectInterviewRecord?id='+e.currentTarget.dataset.id
    });
  },
  
  interviewDescBlur(e) {
    this.setData({
      interviewDesc: e.detail.value
    });
  },

  interviewDateChange(e) {
    this.setData({
      interviewDate: e.detail.value
    });
  },
  
  // 上传图片
  chooseImg: function (e) {
    let that = this;
    let fileList = this.data.fileList;
    if (fileList.length >= 5) {
      wx.showToast({
        icon: 'error',
        title: '最多上传五张图片'
      });
      return
    };
    wx.showLoading({
      title: '上传中...'
    });
    this.setData({
      canNotSave: true
    }, () => {
      wx.chooseMedia({
        // count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          fetch.upload('/sys/common/upload', res.tempFiles[0].tempFilePath, { biz: 'temp' }).then(resolve => {
            console.log('resolve', resolve);
            wx.hideLoading();
            if(resolve.code == 200) {
              let pathList = that.data.confirmFileList;
              pathList.push({ path: resolve.result.path });
              wx.showToast({
                title: resolve.message,
                icon: 'none'
              });
              that.setData({
                confirmFileList: pathList
              });
            };
            that.setData({
              canNotSave: false
            });
          });
          let tempFiles = res.tempFiles;
          let fileList = that.data.fileList;
          for(let i = 0; i < tempFiles.length; i++) {
            if (fileList.length >= 9) {
              that.setData({
                fileList: fileList
              });
              return false;
            } else {
              fileList.push(tempFiles[i].tempFilePath);
            }
          };
          console.log(fileList);
          that.setData({
            fileList: fileList
          });
        },
        fail: () => {
          wx.hideLoading();
          this.setData({
            canNotSave: false
          });
        },
        complete: () => {}
      });
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

  toCheck() {
    if(this.data.interviewDesc == '') {
      wx.showToast({
        title: '请填写走访事项描述！',
        icon: 'none'
      });
      return false;
    };
    if(this.data.interviewDate == '') {
      wx.showToast({
        title: '请选择走访时间！',
        icon: 'none'
      });
      return false;
    };
    return true;
  },
  
  toSave() {
    if(!this.toCheck()) return;
    wx.showLoading({
      title: '加载中',
    });
    let params = {
      interviewDate: this.data.interviewDate,
      itemDescription: this.data.interviewDesc,
      projectInfoId: this.data.projectId,
      voList: this.data.confirmFileList
    };
    let url = '/project/projectInterviewRecords/save';
    if(this.data.interviewId != null) {
      url = '/project/projectInterviewRecords/update';
      params = {
        id: this.data.interviewInfo.id,
        itemDescription: this.data.interviewDesc,
        voList: this.data.confirmFileList
      };
    };
    fetch.post(url, params).then(res => {
      if(res.code == 200) {
        wx.showToast({
          title: res.message,
          icon: 'none'
        });
        wx.hideLoading();
        setTimeout(() => {
          this.setData({
            interviewDesc: '',
            interviewDate: '',
            fileList: [],
            confirmFileList: []
          }, () => {
            if(this.data.interviewId != null) {
              wx.navigateBack();
              return
            };
            wx.navigateTo({
              url: '/pages/subPagesForEcharts/pages/projectInterviewRecord/projectInterviewRecord?id=' + this.data.projectInfo.projectInfo.id,
            });
          });
        }, 1500);
      };
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      projectId: options.id ? options.id : '',
      interviewId: options.interviewId ? options.interviewId : null
    }, () => {
      if(this.data.interviewId != null) this.getProviewDetail();
    });
    this.getProjectData();
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