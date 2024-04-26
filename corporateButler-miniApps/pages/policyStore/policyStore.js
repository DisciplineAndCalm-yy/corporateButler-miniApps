// pages/policyStore/policyStore.js
import { fetch } from '../../utils/util.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
    isMatch: false,
    dropActive: 0,
    policyTitle: '',
    specialFilter: '',
    keysActive: 0,
    policyLevel: {
      value: '',
      options: [],
    },
    department: {
      value: [],
      options: [],
    },
    policyType: {
      value: [],
      options: [],
    },
    productType: {
      value: [],
      options: [],
    },
    policyClassify: {
      value: '0,1',
      options: [
        {
          label: '全部',
          value: '0,1'
        },
        {
          label: '申报奖励',
          value: '1'
        },
        {
          label: '惠企政策',
          value: '0'
        }
      ],
    },
    policyData: [],
    cardTypeMap: {
      '申报奖励': '1',
      '惠企政策': '0'
    },
    lastdomId: '',
    currentdomId: '',
    pageSize: 6,
    pageNo: 1,
    index: 5,
    nomore: false,

    dropActiveMap: {
      '1': 'dropActive1',
      '2': 'dropActive2',
      '3': 'dropActive3',
      '4': 'dropActive4'
    },
    declarable: '0',
    radioStatus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //  获取全局参数，在上一个页面赋值的
    const isMatch = app.globalData.isMatch;
    if(isMatch != null && isMatch != undefined) {
      this.setData({
        isMatch: isMatch
      });
    };
    if(typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      });
    };
    // 还原全局数据
    app.globalData.isMatch = false;

    this.setData({
      policyTitle: '',
      policyLevel: {
        value: '',
        options: [],
      },
      department: {
        value: [],
        options: [],
      },
      policyType: {
        value: [],
        options: [],
      },
      productType: {
        value: [],
        options: [],
      },
      specialFilter: '',
      keysActive: 0,
      policyData: [],
      pageNo: 1,
      pageSize: 6,
      'policyClassify.value': '0,1'
    });

    this.getPolicyData();
    this.getPolicyLevel();
    this.getDepartment();
    this.getPolicyType();
    this.getProductType();
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.setData({
      policyData: [],
      pageNo: 1,
      pageSize: 6
    }, ()=> {
      this.getPolicyData();
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
      this.getPolicyData();
    })
  },

  getPolicyLevel() {
    fetch.get('/policy/dict/getLevel').then(res => {
      let list = [{
        label: '全部',
        value: ''
      }];
      res.result.map(el => {
        let obj = {};
        obj.label = el;
        obj.value = el;
        list.push(obj);
      });
      this.setData({
        'policyLevel.options': list
      });
    });
  },

  getDepartment() {
    fetch.get('/policy/dict/getPublicityOrg').then(res => {
      let list = [];
      res.result.map(el => {
        let obj = {};
        obj.label = el;
        obj.value = el;
        list.push(obj);
      });
      this.setData({
        'department.options': list
      });
    });
  },

  getPolicyType() {
    fetch.get('/policy/dict/getType').then(res => {
      let list = [];
      res.result.map(el => {
        let obj = {};
        obj.label = el;
        obj.value = el;
        list.push(obj);
      });
      this.setData({
        'policyType.options': list
      });
    });
  },

  getProductType() {
    fetch.get('/policy/dict/getIndustryType').then(res => {
      let list = [];
      // let list = [{
      //   label: '全部',
      //   value: ''
      // }];
      res.result.map(el => {
        let obj = {};
        obj.label = el;
        obj.value = el;
        list.push(obj);
      });
      this.setData({
        'productType.options': list
      });
    });
  },

  getDataByKeys(e) {
    const currentKeys = e.currentTarget.dataset.active;
    if(this.data.keysActive == currentKeys) {
      this.setData({
        policyTitle: '',
        'policyLevel.value': '',
        'department.value': [],
        'policyType.value': [],
        'productType.value': [],
        policyData: [],
        specialFilter: '',
        keysActive: 0,
        pageNo: 1,
        pageSize: 6,
        'policyClassify.value': '0,1'
      }, () => {
        this.getPolicyData();
      });
      return
    }
    this.setData({
      policyTitle: '',
      'policyLevel.value': '',
      'department.value': [],
      'policyType.value': [],
      'productType.value': [],
      policyData: [],
      specialFilter: e.currentTarget.dataset.keys,
      keysActive: currentKeys,
      pageNo: 1,
      pageSize: 6,
      'policyClassify.value': '0,1'
    }, () => {
      this.getPolicyData();
    });
  },

  getPolicyData() {
    wx.showLoading({
      title: '加载中',
    });
    let departmentStr = '', policyTypeStr = '', productTypeStr = '';
    this.data.department.value.forEach((el, index) => {
      departmentStr += index > 0 ? ',' + el : el;
    });
    this.data.policyType.value.forEach((el, index) => {
      policyTypeStr += index > 0 ? ',' + el : el;
    });
    this.data.productType.value.forEach((el, index) => {
      productTypeStr += index > 0 ? ',' + el : el;
    });
    let data = {
      visitSource: 0, //  0-小程序，1-pc
      policyClassify: '0,1',
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize,
      policyTitle: this.data.policyTitle,
      policyLevel: this.data.policyLevel.value,
      policyClassify: this.data.policyClassify.value,
      declarable: this.data.policyClassify.value == '1' ? this.data.declarable : '',
      orgCode: departmentStr,
      policyType: policyTypeStr,
      policyIndustry: productTypeStr,
      specialFilter: this.data.specialFilter,
    };
    fetch.get('/policy/base/manualCollectPolicyList', data).then(res => {
      this.setData({
        policyData: this.data.pageNo > 1 ? this.data.policyData.concat(res.result.records) : res.result.records,
        nomore: res.result.current >= res.result.pages ? true : false
      }, () => {
        wx.hideLoading();
      });
    });
  },

  searchTitle(e) {
    this.setData({
      pageNo: 1,
      pageSize: 6,
      policyTitle: e.detail.value,
      specialFilter: '',
      keysActive: 0
    }, () => { this.getPolicyData(); })
  },
  //  政策级别change事件
  onDropPolicyLevelChange(e) {
    // lastdomId: '',
    // currentdomId: '',
    this.setData({
      pageNo: 1,
      pageSize: 6,
      dropActive: 1,
      'policyLevel.value': e.detail.value,
      specialFilter: '',
      keysActive: 0
    }, () => {
      this.getPolicyData();
    });
  },
  //  发布机构change事件
  onDropDepartmentChange(e) {
    this.setData({
      pageNo: 1,
      pageSize: 6,
      dropActive: 2,
      'department.value': e.detail.value,
      specialFilter: '',
      keysActive: 0
    });
  },
  //  发布机构confirm事件
  onDropDepartmentConfirm() {
    this.getPolicyData();
  },
  //  发布机构reset事件
  onDropDepartmentReset() {
    this.getPolicyData();
  },

  //  政策类型change事件
  onDropPolicyTypeChange(e) {
    this.setData({
      pageNo: 1,
      pageSize: 6,
      dropActive: 2,
      'policyType.value': e.detail.value,
      specialFilter: '',
      keysActive: 0
    });
  },
  //  政策类型confirm事件
  onDropPolicyTypeConfirm() {
    this.getPolicyData();
  },
  //  政策类型reset事件
  onDropPolicyTypeReset() {
    this.getPolicyData();
  },
  //  产业类型change事件
  onDropProductTypeChange(e) {
    this.setData({
      pageNo: 1,
      pageSize: 6,
      dropActive: 3,
      'productType.value': e.detail.value,
      specialFilter: '',
      keysActive: 0
    });
  },
  //  产业类型confirm事件
  onDropProductTypeConfirm() {
    this.getPolicyData();
  },
  //  产业类型reset事件
  onDropProductTypeReset() {
    this.getPolicyData();
  },
  //  政策条线change事件
  onDropPolicyClassifyChange(e) {
    this.setData({
      pageNo: 1,
      pageSize: 6,
      dropActive: 4,
      'policyClassify.value': e.detail.value,
      declarable: e.detail.value == 1 ? '1' : '',
      radioStatus: e.detail.value == 1 ? true : false,
      specialFilter: '',
      keysActive: 0
    }, () => {
      this.getPolicyData();
    });
  },

  // 申报状态
  onRadioChange(e) {
    this.setData({
      radioStatus: e.detail.checked,
      declarable: e.detail.checked ? '1' : '',
      pageNo: 1,
      pageSize: 6,
      specialFilter: '',
      keysActive: 0
    }, () => {
      this.getPolicyData();
    });
  },

  toMatchDetail(e) {
    wx.navigateTo({
      url: '/pages/subpages/pages/policyMatchDetail/policyMatchDetail?isMatch=' + this.data.isMatch + '&notStore=false&policyId=' + e.currentTarget.dataset.policyid,
    })
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
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})