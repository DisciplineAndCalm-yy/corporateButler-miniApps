// pages/subPagesForEcharts/component/carame.js
import { formatTime } from '../../../../utils/util.js';
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
		isAuth: false,
		markPhoto: null,
		prePage: null // 从哪个页面进入
  },

  onLoad: function (options) {
		this.setData({ prePage: options.page })
		wx.showLoading({ title: "正在加载中...", mask: true })
		app.globalData.pageName = this // 将globalData的页面指向自己
		const that = this
		wx.getSetting({
			success: res => {
        console.log('res = = >s', res)
				if (res.authSetting['scope.camera']) {
					// 用户已经授权
					wx.hideLoading()
					that.setData({ isAuth: true })
				} else {
					// 用户还没有授权，向用户发起授权请求
					wx.authorize({
						scope: 'scope.camera',
						success() { // 用户同意授权
							wx.hideLoading()
							that.setData({ isAuth: true })
						},
						fail() { // 用户不同意授权
							that.openSetting().then(res => {
								wx.hideLoading()
								that.setData({ isAuth: true })
							})
						}
					})
				}
			},
			fail: res => {
				wx.hideLoading()
				console.log('获取用户授权信息失败')
			}
		})
	},
  /**
   * 组件的方法列表
   */
  methods: {
    // 打开授权设置界面
    openSetting: function () {
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
    // 服务站端-水印相机-调用摄像头拍照
    camera: function () {
      const that = this
      if (app.globalData.address) {
        const ctx = wx.createCameraContext()
        console.log(ctx)
        ctx.takePhoto({
          quality: 'normal',
          success: (res) => {
            console.log('res拍照', res)
            wx.showLoading({ title: "正在加载图片...", mask: true })
            that.addMark(res.tempImagePath)
          },
          fail (error) {
            wx.showToast({ title: error.errMsg, icon: 'none', duration: 2000 })
            setTimeout( () => { wx.navigateBack() }, 2000)
          }
        })
      } else {
        wx.showModal({ 
          title: '提示', content: '请先授权获取当前地理位置',
          success (res) {
            if (res.confirm) {
              // app.getLocation();
              wx.getLocation({
                type: 'wgs84',
                success (res) {
                  app.globalData.address = res;
                  that.setData({ isAuth: true })
                  const latitude = res.latitude
                  const longitude = res.longitude
                  const speed = res.speed
                  const accuracy = res.accuracy
                }
               })
            } else if (res.cancel) {
              wx.navigateBack()
            }
          }
        })
      }
    },
    // 获取图片信息
    addMark: function (file) {
      const that = this
      wx.getImageInfo({
        src: file,
        success(res) {
          that.getCanvasImg(res)
        }
      })
    },
      // 服务站端-相机-canvas添加水印
    getCanvasImg: function (imgInfo) {
      wx.showLoading({ title: "图片努力生成中...", mask: true })
      const that = this
      const today = formatTime(new Date())
      // const addressTxt = app.globalData.address
      const addressTxt = '开发测试公司'
      let { path, width, height } = imgInfo
      that.setData({ w: width, h: height }) // 720 1206
      // 创建canvas
      const ctx = wx.createCanvasContext('firstCanvas', that)
      ctx.drawImage(path, 0, 0, width, height) // 先画出图片 地址，在canvas上X轴的位置，在canvas上y轴的位置，图片的宽度，图片的高度
      let fontSize = 30
      let rectY = height - 140
      let rectH = 140
      let imgWidth = 100
      let timeY = height - 80
      let addressY = height - 40
      let logoX = width - 120
      let logoY = height - 120
      let txtMaxWidth = width - imgWidth - 80
      if (addressTxt.length > 20) {
        rectY = height - 180
        rectH = 180
        imgWidth = 140
        timeY = height - 120
        addressY = height - 76
        logoX = width - 160
        logoY = height - 160
        txtMaxWidth = width - imgWidth - 80
      }
      ctx.setFontSize(fontSize) //注意：设置文字大小必须放在填充文字之前，否则不生效
      ctx.setFillStyle('rgba(0, 0, 0, .3)')
      ctx.fillRect(0, rectY, width, rectH)
      // ctx.drawImage('/assets/images/logo.png', logoX, logoY, imgWidth, imgWidth)
      ctx.setFillStyle('rgba(255, 255, 255, 1)')
      ctx.fillText(today, 30, timeY)
      if (addressTxt.length < 20) {
        ctx.fillText(addressTxt, 30, addressY)
      } else {
        var chr = addressTxt.split("");//这个方法是将一个字符串分割成字符串数组
        var temp = "";
        var row = [];
        for (var a = 0; a < chr.length; a++) {
          if (ctx.measureText(temp).width < txtMaxWidth) {
            temp += chr[a];
          } else {
            a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
            row.push(temp);
            temp = "";
          }
        }
        row.push(temp); 
      
        // 如果数组长度大于2 则截取前两个
        if (row.length > 2) {
          var rowCut = row.slice(0, 2);
          var rowPart = rowCut[1];
          var test = "";
          var empty = [];
          for (var a = 0; a < rowPart.length; a++) {
            if (ctx.measureText(test).width < 460) {
              test += rowPart[a];
            } else {
              break;
            }
          }
          empty.push(test);
          var group = empty[0] + "..." // 这里只显示两行，超出的用...表示
          rowCut.splice(1, 1, group);
          row = rowCut;
        }
        for (var b = 0; b < row.length; b++) {
          ctx.fillText(row[b], 30, addressY + b * 40, txtMaxWidth);
        }
      }
      ctx.draw(false, (() => {
        setTimeout( () => {
          // 生成图片把当前画布指定区域的内容导出生成指定大小的图片。在 draw() 回调里调用该方法才能保证图片导出成功
          wx.canvasToTempFilePath({
            quality: 0.5,
            fileType: 'jpg',
            canvasId: 'firstCanvas',
            success: function (res) {
              wx.hideLoading()
              that.setData({ 'markPhoto': res.tempFilePath })
            },
            fail: function(error) {
              wx.hideLoading()
              wx.showToast({ title: error.errMsg, icon: 'none', duration: 2000 })
            }
          }, that)
        }, 100)
      })())
    },
    // 重拍
    againBtn: function () {
      this.setData({ 'markPhoto': null })
    },
    // 保存图片到相册
    saveBtn: function () {
      const that = this
      if (that.data.prePage == 'complete') {
        let pages = getCurrentPages() // 获取当前页面
        let prePage = pages[pages.length - 2] // 获取上一页面
        prePage.setData({
          'markPhoto': that.data.markPhoto     //给上一页面的变量赋值
        })
        prePage.uploadMark(that.data.markPhoto) // 调用上一页面的方法（加载数据）
        wx.navigateBack({ delta: 1 }) // 返回上一页面
      } else {
        wx.saveImageToPhotosAlbum({ // 保存图片到系统相册
          filePath: that.data.markPhoto,
          success(res) {
            that.setData({ 'markPhoto': null })
          }
        })
      }
    },
    // 相机返回
    returnCarmera: function () {
      wx.navigateBack()
    },
  }
})
