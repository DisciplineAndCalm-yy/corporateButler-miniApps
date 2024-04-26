// pages/home/home.js
import { fetch } from '../../../../utils/util.js'
import { openFile } from '../../utils/index.js'
// 获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
    params: {
      name: '',
      state: 0,
      pageNo: 1,
      pageSize: 10,
      mangerId: '',
      enterpriseId: null,
      warningDay: null
    },
    appealList: [],
    appealTitle: [
      {
        name: '全部',
        value: '0'
      },
      {
        name: '待接收',
        value: '1' // 显示3个
      },
      {
        name: '已上报',
        value: '6' // 啥都不显示
      },
      {
        name: '处理中',
        value: '2' // 只显示处理完成
      },
      {
        name: '处理完成',
        value: '4' // 啥都不显示
      },
      {
        name: '已退回',
        value: '5' // 啥都不显示
      },
    ],
    currentAppeal: 0,
    authorType: '管家',
    nomore: false
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  // onShow() {
    this.data.params.state = 0
    const userInfo = wx.getStorageSync('userInfo')
    console.log(userInfo.userId);
    this.setData({
      mangerId: userInfo.userId,
      'params.enterpriseId': options.entId ? options.entId : '',
      'params.warningDay': options.warningDay ? options.warningDay : ''
    })
    let _target = `params.mangerId`
    this.setData({
      [_target] : userInfo.userId
    })
    // 获取管家信息
    this.getAppealList()
    this.getConut(userInfo.userId)
    // this.getMangerInfo()
  },
  onShow() {
    const userInfo = wx.getStorageSync('userInfo')
    this.getConut(userInfo.userId)
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.setData({
      appealList: [],
      pageNo: 1,
      pageSize: 10
    }, ()=> {
      this.getAppealList();
    })
    wx.stopPullDownRefresh();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    console.log('this.data.nomore', this.data.nomore);
    if(this.data.nomore) return
    const _target = 'params.pageNo'
    console.log('触底啦');
    this.setData({
      [_target]: this.data.params.pageNo + 1
    }, () => {
      this.getAppealList();
    })
  },
  /**
     * 切换状态选择
     * @param {*} tabValue 状态值
     */
  changeStatusTabl(e) {
    const value = e.currentTarget.dataset.index
    console.log(value);
    this.setData({
      currentAppeal : value
    })
    const tag = e.currentTarget.dataset.tag;
    console.log(tag);
    if(value){
      let _target = `params.${tag}`
      this.setData({
        [_target] : value
      })
    }
    const userInfo = wx.getStorageSync('userInfo')
    this.getConut(userInfo.userId)
    // this.data.params.pageNo = 1
    const _target = 'params.pageNo'
    this.setData({
      [_target]: 1,
      appealList: []
    })
    this.getAppealList(value)
  },
  // 初始化数据
  async getAppealList(value = 0) {
    wx.showLoading({
      title: '加载中',
    });
    const res = await fetch.get('/qixian/manger/list', this.data.params);
    if (res.code == 200 && res.success) {
      const { records } = res.result
      this.setData({
        appealList: this.data.params.pageNo > 1 ? this.data.appealList.concat(records) : records,
        nomore: res.result.current >= res.result.pages ? true : false
      }, () => {
        wx.hideLoading();
      })
      // if (Number(value)) {
      //   const list = records.filter(item => {
      //     if (item.state == value) {
      //       return item
      //     } else if (item.state == 0 && value == 6) {
      //       return item
      //     }
      //   })
      //   this.setData({
      //     appealList: list || []
      //   })
      // } else if (value == 0) {
      //   this.setData({
      //     appealList: records || []
      //   })
      // } 
    }
    const userInfo = wx.getStorageSync('userInfo')
    this.getConut(userInfo.userId)
  },
  async getConut (id) {
    const data = {
      userId: id,
      enterpriseId: this.data.params.enterpriseId,
      warningDay: this.data.params.warningDay,
      name: this.data.params.name
    }
    const res = await fetch.get('/qixian/manger/stateCount', data);
    if (res.code == 200 && res.success) {
      const counts = res.result
      counts.forEach(item => {
        this.data.appealTitle.forEach(data => {
          if (item.state == data.value) {
            Object.assign(data, item)
          }
          // if (item.state === '00' && data.value === '0') {
          //   Object.assign(data, item)
          // } else if (item.state !== '0' || item.state !== '0'){
          //   if (item.state === data.value) {
          //     Object.assign(data, item)
          //   }
          // }
        })
      })
      this.setData({
        appealTitle: this.data.appealTitle.concat()
      })
    }
  },
  search (e) {
    let value = e.detail.value
    let tag = e.currentTarget.dataset.tag;
    let _target = `params.${tag}`
    console.log('_target', _target);
    this.setData({
      [_target] : value
    })
    console.log('searchName', this.data.searchName);
    this.getAppealList()
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
      file.accomplishFileUrl.includes(fileType)
    )
    if (isFile) {
      openFile(file.accomplishFileUrl)
    } else {
      wx.previewImage({
        current: file.accomplishFileUrl, // 当前显示图片的http链接
        urls: [file.accomplishFileUrl], // 需要预览的图片http链接列表
      })
    }
  },
  goDetail(e) {
    const appeal = e.currentTarget.dataset.id
    const authorType = this.data.authorType
    const detail = encodeURIComponent(JSON.stringify(appeal))
    const state = this.setState(this.data.params.state)
    wx.navigateTo({
      url: `/pages/subpages/pages/detail/detail?id=${appeal.id}&detail=${detail}&state=${state}&authorType=${authorType}`,
    })
  },
  setState (data) {
    switch(Number(data)) {
      case 0:
        return '全部';
      case 1:
        return '待接收';
      case 2:
        return '处理中';
      case 4:
        return '处理完成';
      case 5:
        return '已退回';
      case 6:
        return '已上报';
    }
  }
})