// pages/subPagesForEcharts/pages/clockIn/clockIn.js
import { fetch, baseUrl, formatTime } from '../../../../utils/util.js';
import { getDistances } from '../../utils/util'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuHeight: app.globalData.menuHeight,
    menuTop: app.globalData.menuTop,
    textareaValue: '',
    entvalue: 0,
    entNameList: [],
    entNameMap: {},
    canClockIn: true,
    visible: false,
    isAuth: false,
    cameraConfig: {
      position: 'back',
      flash: 'off'
    },
    markPhoto: null,
    latitude: "",
    longitude: "",
    addressDesc: "",
    tempList: [],
    fileList: []
  },

  getEntList() {
    fetch.get('/enterprise/entManger/bindingEnt/list', { userId: this.data.userInfo.userId }).then(res => {
      if(res.code == 200) {
        let entNameList = [], entNameMap = {};
        res.result.records.forEach(el => {
          entNameList.push(el.entName);
          entNameMap[el.entName] = el.id;
        });
        this.setData({
          entNameList,
          entNameMap
        });
      };
    });
  },

  cameraClock() {
    const that = this
		wx.getSetting({
			success: res => {
        console.log('res = = >s', res)
				if (res.authSetting['scope.camera']) {
					// 用户已经授权
					wx.hideLoading()
					that.setData({ isAuth: true, visible: true })
				} else {
					// 用户还没有授权，向用户发起授权请求
					wx.authorize({
						scope: 'scope.camera',
						success() { // 用户同意授权
							wx.hideLoading()
							that.setData({ isAuth: true, visible: true })
						},
						fail() { // 用户不同意授权
							that.openSetting().then(res => {
								wx.hideLoading()
								that.setData({ isAuth: true, visible: true })
							})
						}
					})
				}
			},
			fail: res => {
				wx.hideLoading()
				console.log('获取用户授权信息失败')
			}
    });
    if(!app.globalData.address) {
      wx.showModal({ 
        title: '提示',
        content: '请先授权获取当前地理位置',
        success(res) {
          if(res.confirm) {
            // app.getLocation();
            wx.getLocation({
              type: 'wgs84',
              success (res) {
                app.globalData.address = res;
                const latitude = res.latitude;
                const longitude = res.longitude;
                const speed = res.speed;
                const accuracy = res.accuracy;
                wx.chooseLocation({
                  latitude,
                  longitude,
                  type: 'gcj02', //返回可以用于wx.openLocation的经纬度
                  success (res) {
                    that.setData({
                      isAuth: true,
                      latitude: res.latitude,
                      longitude: res.longitude,
                      addressDesc: res.address
                    });
                  }
                });
              }
             })
          } else if(res.cancel) {
          };
        }
      });
    } else {
      const { latitude, longitude } = app.globalData.address;
      wx.chooseLocation({
        latitude,
        longitude,
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success (res) {
          console.log('chooseLocation', res);
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude,
            addressDesc: res.address
          });
        }
      });
    };
  },

  // 打开授权设置界面
  openSetting() {
    const that = this
    let promise = new Promise((resolve, reject) => {
      wx.showModal({
        title: '授权',
        content: '请先授权获取摄像头权限',
        success(res) {
          if (res.confirm) {
            wx.openSetting({
              success(res) {
                if (res.authSetting['scope.camera']) { // 用户打开了授权开关
                resolve(true)
                } else { // 用户没有打开授权开关， 继续打开设置页面
                that.openSetting().then(res => { resolve(true) })
                }
              },
              fail(res) {
                console.log(res)
              }
            })
          } else if (res.cancel) {
            that.openSetting().then(res => { resolve(true) })
          }
        }
      })
    })
    return promise;
  },

  // 水印相机-调用摄像头拍照
  camera() {
    const that = this;
    const ctx = wx.createCameraContext();
    console.log(ctx);
    ctx.takePhoto({
      quality: 'normal',
      success: (res) => {
        console.log('res拍照', res);
        wx.showLoading({ title: "正在加载图片...", mask: true });
        that.addMark(res.tempImagePath);
      },
      fail (error) {
        wx.showToast({ title: error.errMsg, icon: 'none', duration: 2000 });
        setTimeout( () => { wx.navigateBack() }, 2000);
      }
    });
  },

  // 获取图片信息
  addMark(file) {
    const that = this
    wx.getImageInfo({
      src: file,
      success(res) {
        that.getCanvasImg(res)
      }
    })
  },

  // 相机-canvas添加水印
  getCanvasImg(imgInfo) {
    wx.showLoading({ title: "图片努力生成中...", mask: true });
    const that = this;
    const today = formatTime(new Date());
    const entName = this.data.entNameList[this.data.entvalue];
    // const addressTxt = app.globalData.address
    const addressTxt = entName;
    const addressDesc = this.data.addressDesc;
    let { path, width, height } = imgInfo;
    that.setData({ w: width, h: height });
    // 创建canvas
    const ctx = wx.createCanvasContext('yyCanvas', that);
    ctx.drawImage(path, 0, 0, width, height); // 先画出图片 地址，在canvas上X轴的位置，在canvas上y轴的位置，图片的宽度，图片的高度
    let fontSize = 14;
    let rectY = 0;
    let rectH = 180;
    let imgWidth = 100;
    let timeY = 140;
    let addressY = 120;
    let entNameY = 100;
    let logoX = width - 120;
    let logoY = height - 120;
    let txtMaxWidth = width - imgWidth - 80;
    if(addressTxt.length > 20) {
      rectY = 0;
      rectH = 120;
      imgWidth = 140;
      timeY = 140;
      addressY = 120;
      entNameY = 100;
      logoX = width - 160;
      logoY = height - 160;
      txtMaxWidth = width - imgWidth - 80;
    };
    ctx.setFontSize(fontSize); //注意：设置文字大小必须放在填充文字之前，否则不生效
    ctx.setFillStyle('rgba(0, 0, 0, .3)');
    ctx.fillRect(0, rectY, width, rectH);
    // ctx.drawImage('/assets/images/logo.png', logoX, logoY, imgWidth, imgWidth)
    ctx.setFillStyle('rgba(255, 255, 255, 1)');
    ctx.fillText(today, 30, timeY);
    if(addressTxt.length < 20) {
      ctx.fillText(addressTxt, 30, entNameY);
      ctx.fillText(addressDesc, 30, addressY);
    } else {
      let chr = addressTxt.split("");//这个方法是将一个字符串分割成字符串数组
      let temp = "";
      let row = [];
      for(let a = 0; a < chr.length; a++) {
        if(ctx.measureText(temp).width < txtMaxWidth) {
          temp += chr[a];
        } else {
          a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
          row.push(temp);
          temp = "";
        };
      };
      row.push(temp); 
    
      // 如果数组长度大于2 则截取前两个
      if(row.length > 2) {
        let rowCut = row.slice(0, 2);
        let rowPart = rowCut[1];
        let test = "";
        let empty = [];
        for(let a = 0; a < rowPart.length; a++) {
          if (ctx.measureText(test).width < 460) {
            test += rowPart[a];
          } else {
            break;
          };
        };
        empty.push(test);
        let group = empty[0] + "..." // 这里只显示两行，超出的用...表示
        rowCut.splice(1, 1, group);
        row = rowCut;
      };
      for(let b = 0; b < row.length; b++) {
        ctx.fillText(row[b], 30, addressY + b * 40, txtMaxWidth);
      };
    };
    ctx.draw(false, (() => {
      setTimeout(() => {
        // 生成图片把当前画布指定区域的内容导出生成指定大小的图片。在 draw() 回调里调用该方法才能保证图片导出成功
        wx.canvasToTempFilePath({
          quality: 1,
          fileType: 'jpg',
          canvasId: 'yyCanvas',
          success: function(res) {
            wx.hideLoading();
            that.setData({ 'markPhoto': res.tempFilePath });
          },
          fail: function(error) {
            wx.hideLoading();
            wx.showToast({ title: error.errMsg, icon: 'none', duration: 2000 });
          }
        }, that);
      }, 100);
    })());
  },

  // 重拍
  againBtn() {
    this.setData({ 'markPhoto': null })
  },

  // 保存图片到相册
  // saveBtn() {
  //   const that = this
  //   if (that.data.prePage == 'complete') {
  //     let pages = getCurrentPages() // 获取当前页面
  //     let prePage = pages[pages.length - 2] // 获取上一页面
  //     prePage.setData({
  //       'markPhoto': that.data.markPhoto     //给上一页面的变量赋值
  //     })
  //     prePage.uploadMark(that.data.markPhoto) // 调用上一页面的方法（加载数据）
  //     wx.navigateBack({ delta: 1 }) // 返回上一页面
  //   } else {
  //     wx.saveImageToPhotosAlbum({ // 保存图片到系统相册
  //       filePath: that.data.markPhoto,
  //       success(res) {
  //         that.setData({ 'markPhoto': null })
  //       }
  //     })
  //   }
  // },

  // 切换闪光灯状态
  flashChange() {
    let flash = this.data.cameraConfig.flash;
    switch(flash) {
      case 'off':
        flash = 'on';
        break;
      case 'on':
        flash = 'auto';
        break;
      case 'auto':
        flash = 'off';
        break;
    }
    this.setData({
      'cameraConfig.flash': flash
    });
  },
  // 切换前后置摄像头
  positionChange() {
    let position = this.data.cameraConfig.position;
    switch(position) {
      case 'front':
        position = 'back';
        break;
      case 'back':
        position = 'front';
        break;
    };
    this.setData({
      'cameraConfig.position': position
    });
  },

  getClockImg() {
    wx.showLoading({
      title: '图片上传中...',
      mask: true
    });
    fetch.upload('/sys/common/upload', this.data.markPhoto, { biz: 'temp' }).then(resolve => {
      wx.hideLoading();
      if(resolve.code == 200) {
        let pathList = [], tempList = [];
        pathList.push(resolve.result.path);
        tempList.push(baseUrl.replace('/jeecgboot', '') + resolve.result.tempPath);
        this.setData({
          fileList: pathList,
          tempList: tempList,
          visible: false
        });
      };
    });
  },

  closeCamera() {
    this.setData({ visible: false });
  },
  // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
    let index = e.currentTarget.dataset.index;
    //所有图片
    let tempList = this.data.tempList;
    wx.previewImage({
      //当前显示图片
      current: tempList[index],
      //所有图片
      urls: tempList
    });
  },
  // 删除图片
  deleteImg: function (e) {
    let fileList = this.data.fileList;
    let tempList = this.data.tempList;
    let index = e.currentTarget.dataset.index;
    fileList.splice(index, 1);
    tempList.splice(index, 1);
    this.setData({
      fileList,
      tempList
    });
  },

  toClockIn() {
    this.setData({
      canClockIn: !this.data.canClockIn
    });
  },

  taInput(e) {
    this.setData({
      textareaValue: e.detail.value
    })
  },

  bindFormSubmit: function(e) {
    if(this.data.fileList.length == 0) {
      wx.showToast({
        title: "请拍照打卡！",
        icon: 'none'
      });
      return
    };
    if(e.detail.value.textarea == '') {
      wx.showToast({
        title: "服务事项不能为空！",
        icon: 'none'
      });
      return
    };
    wx.showLoading({
      title: '加载中',
    });
    const params = {
      entId: this.data.entNameMap[this.data.entNameList[this.data.entvalue]],
      content: e.detail.value.textarea,
      file: this.data.fileList[0],
      latitude: this.data.latitude,
      longitude: this.data.longitude
    };
    fetch.post('/enterprise/entMangerRecord/add', params).then(res => {
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
  * 计算两个点经纬度距离
  */
  getDestinationAddress: function() {
    //获取当前经纬度
    let getLocalLng = wx.getStorageSync('lngAndLat');
    //这里经纬度是后台返回的
    let getDistance = getDistances(getLocalLng.lat, getLocalLng.lng, this.data.bizLat, this.data.bizLng);
    this.setData({
        distance: getDistance.distance_str
    })
    //判断超过5公里时不可打卡
    if(this.data.currentChooseType == 1 && parseInt(getDistance.distance) >= 5) {
      this.setData({
        isOutDistance: false
      })
    }
  },

  selectEnt(e) {
    this.setData({
      entvalue: e.detail.value
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let userinfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userinfo
    }, () => this.getEntList());
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