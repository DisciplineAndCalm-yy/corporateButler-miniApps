// pages/subPagesForEcharts/pages/projectStatus/projectStatus.js
import { fetch, formatTime } from '../../../../utils/util.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuHeight: app.globalData.menuHeight,
    menuTop: app.globalData.menuTop,
    projectId: null,
    projectInfo: {},
    toDay: '',
    projectStatusIndex: '',
    statusLabelList: [],
    statusList: [],
    statusDate: '',
    fileType: 'image',   // 文档类型（folder:文件夹 excel:excel doc:word ppt:ppt image:图片 archive:其他文档 video:视频 pdf:pdf）
    uploadPath: '',
    imgList: [],          // 上传列表
    src: '',        // 上传视频

    canShowpopup: false,
    visible: false
  },

  // 点击添加选择
  chooseSource() {
    let _this = this;
    wx.showActionSheet({
      itemList: ["拍照", "从相册中选择"],
      itemColor: "#000000",
      success(res) {
        if(!res.cancel) {
          if(res.tapIndex == 0) {
            _this.imgWShow("camera");       //拍照
          } else if(res.tapIndex == 1) {
            _this.imgWShow("album");     //相册
          };
        };
      }
    });
  },
  // 点击调用手机相册/拍照
  imgWShow(type) {
    let _this = this;
    let len = 0;
    if (_this.data.imgList != null) {
      len = _this.data.imgList.length;
    };   //获取当前已有的图片
    wx.chooseImage({
      count: 2 - len,     //最多还能上传的图片数,这里最多可以上传5张
      sizeType: ['original', 'compressed'],        //可以指定是原图还是压缩图,默认二者都有
      sourceType: [type],             //可以指定来源是相册还是相机, 默认二者都有
      success(res) {
        wx.showToast({
          title: '正在上传...',
          icon: "loading",
          mask: true,
          duration: 1000
        });
        // 返回选定照片的本地文件路径列表,tempFilePaths可以作为img标签的scr属性显示图片
        let imgList = res.tempFilePaths;
        let tempFilePathsImg = _this.data.imgList;
        // 获取当前已上传的图片的数组
        let tempFilePathsImgs = tempFilePathsImg.concat(imgList);

        fetch.upload('/sys/common/upload', imgList[0], { biz: 'temp' }).then(resolve => {
          wx.hideLoading();
          if(resolve.code == 200) {
            wx.showToast({
              title: resolve.message,
              icon: 'none'
            });
            _this.setData({
              uploadPath: resolve.result.path,
              imgList: tempFilePathsImgs
            });
          };
        });
      },
      fail() {
        wx.showToast({
          title: '图片上传失败',
          icon: 'none'
        });
        return;
      }
    });
  },
  // 预览图片
  previewImg(e) {
    let index = e.target.dataset.index;
    let _this = this;
    wx.previewImage({
      current: _this.data.imgList[index],
      urls: _this.data.imgList
    });
  },
  /**
   * 点击删除图片
   */
  deleteImg(e) {
    let _this = this;
    let imgList = _this.data.imgList;
    let index = e.currentTarget.dataset.index;      //获取当前点击图片下标
    wx.showModal({
      title: '提示',
      content: '确认要删除该图片吗?',
      success(res) {
        if (res.confirm) {
          imgList.splice(index, 1);
        } else if (res.cancel) {
          return false;
        };
        _this.setData({
          imgList
        });
      }
    })
  },
  /**
   * 点击删除视频
   */
  deleteVideo(e) {
    let _this = this;
    let src = _this.data.src;
    // let index = e.currentTarget.dataset.index;      //获取当前点击图片下标
    wx.showModal({
      title: '提示',
      content: '确认要删除该视频吗?',
      success(res) {
        if (res.confirm) {
          _this.setData({
            src: ''
          });
        } else if (res.cancel) {
          return false;
        };
      }
    })
  },
  /**
   * 图片  视频 选择框
   */
  actioncnt() {
    let _this = this;
    wx.showActionSheet({
      itemList: ['图片', '视频'],
      success(res) {
        if(res.tapIndex == 0) {
          _this.chooseSource();
          _this.setData({ fileType: 'image' });
        };
        if(res.tapIndex == 1) {
          _this.chooseVideo();
          _this.setData({ fileType: 'video' });
        };
      },
      fail(res) {
        console.log(res.errMsg);
      }
    })
  },
  // 选择模式
  chooseVideo() {
    let _this = this;
    wx.showActionSheet({
      itemList: ["拍摄", "从相册中选择"],
      itemColor: "#000000",
      success(res) {
        if (!res.cancel) {
          if(res.tapIndex == 0) {
            _this.videoShow("camera");        //拍照
          } else if(res.tapIndex == 1) {
            _this.videoShow("album");     //相册
          };
        };
      }
    });
  },
  /**
   * 选择视频
   */
  videoShow(type) {
    let _this = this;
    wx.chooseVideo({
      sourceType: [type],
      success(res) {
        fetch.upload('/sys/common/upload', res.tempFilePath).then(resolve => {
          wx.hideLoading();
          if(resolve.code == 200) {
            wx.showToast({
              title: resolve.message,
              icon: 'none'
            });
            _this.setData({
              uploadPath: resolve.result.path,
              src: res.tempFilePath
            });
          };
        });
      }
    });
  },

  // 选择项目进度状态
  bindStatusChange(e) {
    this.setData({ projectStatusIndex: e.detail.value, canShowpopup: e.detail.value < this.data.projectInfo.phase ? true : false })
  },

  // 选择状态日期
  bindStatusDateChange(e) {
    this.setData({ statusDate: e.detail.value })
  },

  // 跳转项目状态记录
  handleToRecord(e) {
    wx.navigateTo({
      url: '/pages/subPagesForEcharts/pages/projectStatusRecord/projectStatusRecord?id=' + e.currentTarget.dataset.pid
    });
  },

  // 获取项目信息
  getProjectInfo() {
    wx.showLoading({
      title: '加载中',
    });
    const params = {
      id: this.data.projectId
    };
    fetch.get('/wx/project/projectInfo/getById', params).then(res => {
      this.setData({
        projectInfo: res.result
      }, () => {
        wx.hideToast();
        wx.hideLoading();
      });
    });
  },

  // 获取项目进度状态
  getDictList() {
    wx.showLoading({
      title: '加载中',
    });
    fetch.get('/sys/dict/getDictItems/project_info_phase').then(res => {
      let statusLabelList = [];
      res.result.map(el => statusLabelList.push(el.label));
      this.setData({
        statusList: res.result,
        statusLabelList
      }, () => {
        wx.hideToast();
        wx.hideLoading();
      });
    });
  },

  onVisibleChange(e) {
    this.setData({
      visible: e.detail.visible
    });
  },

  goBack() {
    //返回上一个页面
    wx.navigateBack();
  },

  // 保存
  openSubmit() {
    if(!this.data.canShowpopup) {
      this.saveData();
    } else {
      this.setData({ visible: true });
    }
  },

  // 关闭弹窗
  closePopup() {
    this.setData({ visible: false });
  },

  // 弹窗确认
  toConfirm() {
    this.saveData();
  },

  // 确认保存
  saveData() {
    if(!this.data.projectStatusIndex) {
      wx.showToast({
        title: '请选择项目进度状态！',
        icon: 'none',
        duration: 2000
      });
      return
    };
    if(!this.data.statusDate) {
      wx.showToast({
        title: '请选择当前状态日期！',
        icon: 'none',
        duration: 2000
      });
      return
    };
    wx.showLoading({
      title: '加载中',
    });
    const that = this;
    const phaseEl = this.data.statusList[this.data.projectStatusIndex];
    const params = {
      id: this.data.projectId,
      phase: phaseEl.value,
      projectFileSaveVo: {
        fileType: this.data.fileType,
        path: this.data.uploadPath
      },
      statusTime: this.data.statusDate
    };
    fetch.post('/project/projectInfo/saveProjectProgressStatus', params, { 'content-type': 'application/json' }).then(res => {
      wx.hideLoading();
      if(res.code == 200) {
        wx.showToast({
          title: res.message,
          icon: 'none'
        });
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/subPagesForEcharts/pages/projectStatusRecord/projectStatusRecord?id=' + that.data.projectId
          });
        }, 1500);
      };
      if(res.code == 500) {
        wx.hideToast();
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: res.message,
          complete: (res) => {
            if (res.cancel) {
            }
            if (res.confirm) {
            }
          }
        })
      };
      that.setData({
        visible: false
      });
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const toDay = formatTime(new Date(), '-', true);
    this.setData({
      toDay,
      projectId: options.id ? options.id : null
    });
    this.getProjectInfo();
    this.getDictList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow(options) {
    
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