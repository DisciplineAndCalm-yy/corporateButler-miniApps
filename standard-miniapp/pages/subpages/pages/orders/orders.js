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
      state: 0,
      userId: '',
      item: '',
      pageNo: 1,
      pageSize: 10,
    },
    appealList: [],
    appealTitle: [
      {
        name: '全部',
        value: '0'
      },
      {
        name: '已收件',
        value: '1'
      },
      {
        name: '处理中',
        value: '2'
      },
      {
        name: '处理完成',
        value: '3'
      },
      {
        name: '已评价',
        value: '4'
      },
    ],
    scoreOptions: [
      { label: '5分', value: 5 },
      { label: '4分', value: 4 },
      { label: '3分', value: 3 },
      { label: '2分', value: 2 },
      { label: '1分', value: 1 },
    ],
    currentAppeal: 0,
    authorType: '用户',
    appealId: '',
    isShow: false,
    dialogTitle: '我要评价',
    nomore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  // onShow() {
    this.data.params.state =  0
    const userInfo = wx.getStorageSync('userInfo')
    let _target = `params.userId`
      this.setData({
        [_target] : userInfo.userId
      })
    this.getAppealList()
    this.getConut()
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
      if(this.data.nomore) return
      const _target = 'params.pageNo'
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
    const tag = e.currentTarget.dataset.tag;
    this.setData({
      currentAppeal : value
    })
    if(value){
      let _target = `params.${tag}`
      this.setData({
        [_target] : value
      })
    }
    this.getConut()
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
    const res = await fetch.get('/qixian/consultingService/list', this.data.params);
    if (res.code == 200 && res.success) {
      const { records } = res.result
      if (Number(value)) {
        const list = records.filter(item => {
          if (item.state == value || (item.state == 0 && value == 1) || (item.state == 3 && value == 2) || (item.state == 7 && value == 2) || (item.state == 4 && value == 3) || (item.state == 5 && value == 3) || (item.state == 5 && value == 4)) {
            return item
          }
        }).map(item => {
          if (item.item == '政策咨询,') {
            item.item = item.item.replace(',', '')
            return item
          } else {
            return item
          }
        })
        this.setData({
          appealList: this.data.params.pageNo > 1 ? this.data.appealList.concat(list) : list,
          nomore: res.result.current >= res.result.pages ? true : false
        }, () => {
          wx.hideLoading();
        })
      } else if (value == 0) {
        records.map(item => {
          if (item.item == '政策咨询,') {
            item.item = item.item.replace(',', '')
            return item
          } else {
            return item
          }
        })
        this.setData({
          appealList: this.data.params.pageNo > 1 ? this.data.appealList.concat(records) : records,
          nomore: res.result.current >= res.result.pages ? true : false
        }, () => {
          wx.hideLoading();
        })
      }
      const userInfo = wx.getStorageSync('userInfo')
      this.getConut(userInfo.userId)
    }
  },
  async getConut () {
    // 传用户id
    const userInfo = wx.getStorageSync('userInfo')
    const params = {
      userId: userInfo.userId,
      item: this.data.params.item
    }
    const res = await fetch.get('/qixian/consultingService/stateCount', params);
    if (res.code == 200 && res.success) {
      const counts = res.result
      counts.forEach(item => {
        this.data.appealTitle.forEach(data => {
          if (item.state === data.value) {
            Object.assign(data, item)
          }
        })
      })
      this.setData({
        appealTitle: this.data.appealTitle.concat()
      })
    }
  },
  // 搜索
  // handleSearch(e) {
    // let value = e.detail.value;
    // let tag = e.currentTarget.dataset.tag;
    // if(value){
    //   let _target = `params.${tag}`
    //   this.setData({
    //     [_target] : value
    //   })
    // }
  // },
  search (e) {
    let value = e.detail.value
    let tag = e.currentTarget.dataset.tag;
    let _target = `params.${tag}`
    this.setData({
      [_target] : value
    })
    this.getAppealList()
  },
  //接受弹出框点击反馈监听事件，来进行隐藏弹出框
  clickDialog(e){
    this.setData({
      isShow: e.detail.isShow,
    })
    this.getConut();
    this.getAppealList('3');
  },
  // 待评价
  onEvaluate (e) {
    this.setData({
      appealId: e.currentTarget.dataset.item.id,
    })
    this.setData({
      isShow: true,
    })
    this.setData({
      dialogTitle: '我要评价',
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
    console.log(appeal);
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
        return '已收件';
      case 2:
        return '处理中';
      case 3:
        return '处理完成';
      case 4:
        return '已评价';
    }
  }
})