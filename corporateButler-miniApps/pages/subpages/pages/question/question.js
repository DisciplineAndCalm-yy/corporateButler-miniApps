// pages/subpages/pages/question/question.js
import { fetch, baseUrl } from '../../../../utils/util.js'
import { openFile } from '../../utils/index.js'
const app = getApp(); //  获取小程序实例
Page({
  /**
   * 页面的初始数据
   */
  data: {
    menuTop: app.globalData.menuTop,  //  获取小程序顶部距离，适配各种手机型号对齐右上角胶囊导航栏
    menuHeight: app.globalData.menuHeight,  //  获取小程序胶囊高度
    formData: {
      item: '', // 事项名称一级
      itemSecondary: '', // 事项名称二级
      content: '', // 内容描述
      enterprise: '', // 企业名称
      contact: '', // 联系人
      phoneNumber: '', // 联系方式
    },
    enterprise: '',
    fileList: [],
    currentIndex: '1',
    isShowInput: false,
    mangerName: '',
    mangerId: '', // 服务管家ID
    loading: false,
    visible: false,
    currentContentLength: 0, // 当前长度
    firstFloor: '',
    secondFloor: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getMangerInfo()
  },
  handleChooseItem () {
    this.setData({
      visible: true,
    })
    console.log('visible', this.data.visible);
  },
  clickPopup(e) {
    this.data.formData.item = e.detail.firstFloor
    this.data.formData.itemSecondary = e.detail.secondFloor
    this.setData({
      visible: e.detail.visible,
      formData: this.data.formData,
    })
  },
  handleDel (e) {
    const index = e.currentTarget.dataset.index
    const file = this.data.fileList[index]
    this.data.fileList = this.data.fileList.filter(item=> item.name !== file.name)
    this.setData({
      fileList: this.data.fileList.concat()
    })
  },
  getMangerInfo () {
    const entInfo = wx.getStorageSync('entInfo')
    this.setData({
      enterprise: entInfo.entName
    })
    fetch.get('/enterprise/entMangerApply/finishBinding/manger?entId=' + entInfo.id)
    .then(data => {
      const { result, success } = data
      if (result && success) {
        if (result.length == 1) {
          this.setData({
            isShowInput: true
          })
          this.setData({
            mangerName: result[0].realname
          })
          this.setData({
            mangerId: result[0].userId
          })
        } else if (result.length == 2) {
          for (const item of result) {
            if (item.grade == 'x') {
                this.setData({
                  isShowInput: true
                })
                this.setData({
                  mangerName: item.realname
                })
                this.setData({
                  mangerId: item.userId
                })
            }
          }
        }
      }
    })
    .catch(error => {
      console.log(error);
    })
  },
  handleOpenFile(e) {
    const index = e.currentTarget.dataset.index;
    const file = this.data.fileList[index];
    const fileTypes = [
      '.pdf',
      '.doc',
      '.docx',
      '.xls',
      '.xlsx',
      '.ppt',
      '.pptx',
    ]
    const isFile = fileTypes.some((fileType) =>
      file.path.includes(fileType)
    )
    if (isFile) {
      openFile(file.path)
    } else {
      wx.previewImage({
        current: file.path, // 当前显示图片的http链接
        urls: [file.path], // 需要预览的图片http链接列表
      })
    }
  },
  // 取消
  cancel () {
    wx.switchTab({
      url: '/pages/home/home',
    })
  },
  // 提交
  async formSubmit(event) {
    const enterpriseId = wx.getStorageSync('entInfo').id
    const formData = Object.assign(this.data.formData, event.detail.value);
    const validate = this.validate(formData)
    if (validate) {
      this.setData({
        loading: true
      })
      const userInfo = wx.getStorageSync('userInfo')
      const params = {
        ...formData,
        sourceType: 0,
        type: 1,
        createTime: this.formatTime(Date.now()),
        userId: userInfo.userId,
        mangerId: this.data.mangerId,
        mangerName: this.data.mangerName,
        enterpriseId
      }
      try {
        const { result } = await fetch.post('/qixian/appeal/complaintAdd', params);
        const uploadMethods = this.batchUpload(result)
        Promise.all(uploadMethods)
          .then((res) => {
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              mask: true,
            })
            this.setData({
              loading: false
            })
          })
          .catch((err) => {
            wx.showToast({
              title: '提交失败',
              icon: 'none',
              mask: true,
            })
            console.log('提交失败', err);
            this.setData({
              loading: false
            })
            complaintDelete({ id })
          })
          wx.requestSubscribeMessage({
            //模板ID
            tmplIds: ['sSMkO6AsQupjC21_Rn-RhhCIIg88kaqf5EgRu9DZ6nY'],
            success: (res) => {
              //模板ID
              console.log(res);
              if (res['sSMkO6AsQupjC21_Rn-RhhCIIg88kaqf5EgRu9DZ6nY'] === 'accept') 
              {
                wx.showToast({
                  title: '订阅成功！',
                  duration: 1000,
                  success(data) {
                    setTimeout(() => {
                      wx.navigateBack({
                        delta: 1,
                      })
                    }, 1000)
                    console.log('从这儿出去的3');
                  }
                })
              } else {
                setTimeout(()=> {
                  wx.switchTab({
                    url: '/pages/home/home',
                  })
                }, 1000)
                console.log('从这儿出去的4');
              }
            },
            fail(err) {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1,
                })
              }, 1000)
              console.log('订阅失败', err);
            }
          })
        } catch (error) {
          wx.showToast({
            title: '提交失败',
            icon: 'none',
          })
          console.log('提交失败', error);
        }
    }
  },
  batchUpload(id) {
    return this.data.fileList.map((file) => {
      return this.uploadFile(file.path, id)
    })
  },
  uploadFile(path, complaintId) {
    return new Promise((resolve, reject) => {
      let token = wx.getStorageSync('token');
      wx.uploadFile({
        url: `${baseUrl}/qixian/appeal/complaintAddFile`, //仅为示例，非真实的接口地址 
        filePath: path,
        name: 'file',
        header: {
          'X-Access-Token': token,
        },
        formData: {
          id: complaintId,
        },
        success(res) {
          resolve(res)
        },
        fail(err) {
          reject(err)
        },
      })
    })
  },
  handleShowUploadAction() {
    wx.showActionSheet({
      itemList: ['相册', '附件'],
      success: (res) => {
        if (res.tapIndex == 0) {
          this.handleChooseImage()
        } else {
          this.handleChooseMsgFile()
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      },
    })
  },
  handleChooseImage() {
    let that = this
    wx.chooseImage({
      count: 100, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        res.tempFilePaths.forEach(async (path, index) => {
          const fileData = await that.readFile(path)
          console.log(fileData);
          that.data.fileList.push({
            path,
            type: 'img',
            fileData: fileData.data,
            name: `文件${Math.round(Math.random()*100000000) + index + 1}`,
            type: 'img',
          })
          that.setData({ 
            fileList: that.data.fileList.concat()
          })
          console.log(that.data.fileList);
        })
      },
    })
  },
  handleChooseMsgFile() {
    let that = this
    wx.chooseMessageFile({
      count: 100,
      type: 'file',
      success: (res) => {
        res.tempFiles.forEach(async (file, index) => {
          const fileData = await that.readFile(file.path)
          console.log(fileData);
          that.data.fileList.push({
            path: file.path,
            type: 'file',
            fileData: fileData.data,
            name: `文件${Math.round(Math.random()*100000000) + index + 1}`,
          })
          that.setData({ 
            fileList: that.data.fileList.concat()
          })
          console.log(that.data.fileList)
        })
      },
    })
  },
  readFile(filePath) {
    const fs = wx.getFileSystemManager()
    return new Promise((resolve, reject) => {
      fs.readFile({
        filePath: filePath,
        encoding: 'binary',
        position: 0,
        success(res) {
          const fileTypes = [
            '.pdf',
            '.doc',
            '.docx',
            '.jpg',
            '.jpeg',
            '.png',
          ]
          const isFile = fileTypes.some((fileType) =>
            filePath.includes(fileType)
          )
          if (isFile) {
            resolve(res)
            console.log('成功');
          } else {
            wx.showToast({
              title: '仅支持上传doc、pdf文件',
              icon: 'none',
              mask: true,
            })
          }
        },
        fail(res) {
          console.log('失败');
          console.error(res)
        },
      })
    })
  },
  /** 验证表单必填项 */
  validate(data) {
    const { item, itemSecondary, content, enterprise, contact, phoneNumber } = data
    //手机号正则
    const Z = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
    //座机号正则
    const ZZ = /^(?:(?:\d{3}-)?\d{8}|^(?:\d{4}-)?\d{7,8})(?:-\d+)?$/
    if ((item === '' || itemSecondary === '') || (item === undefined || itemSecondary === undefined)) {
      wx.showToast({
        title: '请选择事项名称',
        icon: 'none',
        mask: true,
      })
      return false
    }
    if (content === '') {
      wx.showToast({
        title: '请输入内容描述',
        icon: 'none',
        mask: true,
      })
      return false
    }
    if (enterprise === '') {
      wx.showToast({
        title: '请输入企业名称',
        icon: 'none',
        mask: true,
      })
      return false
    }
    if (contact === '') {
      wx.showToast({
        title: '请输入联系人',
        icon: 'none',
        mask: true,
      })
      return false
    }
    if (!ZZ.test(phoneNumber) && !Z.test(phoneNumber)) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
        mask: true,
      })
      return false
    }
    return true
  },
  formatTime(date) {
    date = new Date(date)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    return `${year}-${this.addZero(month)}-${this.addZero(
      day
    )} ${this.addZero(hours)}:${this.addZero(minutes)}:${this.addZero(
      seconds
    )}`
  },
  addZero(value) {
    return value < 10 ? '0' + value : value
  },
  // textarea长度
  inputs (e) {
    console.log(e);
    // 获取输入框的内容
    const value = e.detail.value;
    // 获取输入框内容的长度
    const len = parseInt(value.length);
    this.setData({
      currentContentLength: len
    })
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