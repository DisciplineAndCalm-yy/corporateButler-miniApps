// pages/subpages/pages/answer/answer.js
import { fetch } from '../../../../utils/util.js'
const app = getApp(); //  获取小程序实例
Page({
  /**
   * 页面的初始数据
   */
  data: {
    menuTop: app.globalData.menuTop,  //  获取小程序顶部距离，适配各种手机型号对齐右上角胶囊导航栏
    menuHeight: app.globalData.menuHeight,  //  获取小程序胶囊高度
    formData: {
      item: '',    // 事项名称
      content: '',    // 事项内容
      enterprise: '', // 企业名称
      contact: '',       // 联系人
      phoneNumber: '',   // 联系方式
    },
    enterprise: '', 
    mangerName: '', // 服务管家
    mangerId: '', // 服务管家ID
    serviceButler: '服务管家',  // 服务管家
    itemOptions: [],
    itemOptionsTab: [],
    isShowInput: false, // 是否展示服务管家
    loading: false,
    currentContentLength: 0, // 当前长度
    dateVisible: false, // 是否打开picker
    currentItemIds: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取下拉列表
    this.getItemList()
    // 获取管家信息
    this.getMangerInfo()
  },
  /** 获取指标列表 */
  async getItemList(data = '') {
    const res = await fetch.get('/qixian/item/MobileQueryList?secondaryBinding=' + data);
    if (res.success && res.code == 200) {
      const filteredData = res.result
        .filter((record) => record.state === '已激活')
        .map((record) => ({
          label: record.name,
          value: record.id,
        }))
      if (!data) {
        this.setData({
          itemOptions: [...this.data.itemOptions, ...filteredData]
        })
      } else {
        // 有id 二级下拉框
        this.setData({
          itemOptionsTab: [...filteredData]
        })
      }
    }                                                                                                                                              
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
  // 提交
  async formSubmit(event) {
    const formData = Object.assign({
      item: this.data.formData.item
    }, event.detail.value)
    console.log('event.detail.value', formData);
    const validate = this.validate(formData)
    if (validate) {
      this.setData({
        loading: true
      })
      const userInfo = wx.getStorageSync('userInfo')
      const enterpriseId = wx.getStorageSync('entInfo').id
      const params = {
        ...formData,
        sourceType: 0,
        type: 0,
        createTime: this.formatTime(Date.now()),
        userId: userInfo.userId,
        mangerId: this.data.mangerId, // 管家id
        mangerName: this.data.mangerName, // 管家名称
        enterpriseId
      }
      const res = await fetch.post('/qixian/appeal/add', params)
      if (res.success && res.code == 200) {
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          mask: true,
        })
        this.setData({
          loading: false
        })
      } else {
        wx.showToast({
          title: '提交失败',
          icon: 'none',
          mask: true,
        })
        this.setData({
          loading: false
        })
      }
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
                setTimeout(()=> {
                  wx.switchTab({
                    url: '/pages/home/home',
                  })
                }, 1000)
              }
            })
          } else {
            setTimeout(()=> {
              wx.switchTab({
                url: '/pages/home/home',
              })
            }, 1000)
          }
        },
        fail(err) {
          console.log(err);
          setTimeout(() => {
            wx.navigateBack({
              delta: 1,
            })
          }, 1000)
          request?.prompt.showToast('请开启订阅消息权限', 'none')
        }
      })
    }
  },
  /** 验证表单必填项 */
  validate(data) {
    const { item, content, enterprise, contact, phoneNumber } = data;
    //手机号正则
    const Z = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    //座机号正则
    const ZZ = /^(?:(?:\d{3}-)?\d{8}|^(?:\d{4}-)?\d{7,8})(?:-\d+)?$/;
    if (item === '') {
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
  // 点击打开picker
  onItemPicker () {
    this.setData({ 
      dateVisible: true 
    });
    let itemValue = ''
    if (this.data.currentItemIds) {
      itemValue = this.data.currentItemIds
    } else {
      itemValue = this.data.itemOptions[0]?.value
    }
    this.getItemList(itemValue)
  },
  // 选择picker左侧选项
  onColumnChange (e) {
    const id = e?.detail?.value[0];
    const column = e?.detail?.column;
    if (!column) {
      this.getItemList(id)
    }
  },
  // picker-确认
  onPickerChange(e) {
    console.log('e', e);
    let item = e.detail?.label?.join();
    let ids = e.detail?.value[0];
    console.log('当前项的id', ids);
    if (item.slice(-1) === ',') {
      item = item.replace(',','')
    }
    this.setData({
      'formData.item': item,
      currentItemIds: ids
    })
    console.log(this.data.formData.item);
  },
  // picker-取消
  onPickerCancel() {
    console.log('picker-取消');
    console.log(this.data.formData.item);
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

  },
})