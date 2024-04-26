// pages/accuratePush/accuratePush.js
const app = getApp();
import { fetch } from '../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isMatch: false,
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
    entInfo: {},
    tabIndex: 0,
    selectIndex: 0,
    selectIndexMap: {},
    levelList: [],
    pageNo: 1,
    pageSize: 5,
    nomore: false,
    declareMoney: 0,
    declarePolicyCount: 0,
    allDeclarePolicyCount: 0,
    matchPolicyData: [],
    index: 5,
    showSubscribe: false,
    policyCss: {
      '政策层级': 'policy_leave_css',
      '政策类型': 'policy_type_css',
      '产业类型': 'production_type_css',
      '申报类型': 'push_type_css',
      '行业分类': 'industry_info_css',
      '政策对象': 'policy_object_css',
      '政策主题': 'policy_theme_css'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(options && options.entId != undefined && options.entId != null && options.entId != '') {
      fetch.get('/enterprise/entInfo/queryEntAll', { entId: options.entId, isToCode: false }).then(res => {
        wx.setStorageSync('entInfo', res.result.entInfo);
        this.setData({
          entInfo: res.result.entInfo
        });
      });
    };
    //  获取全局参数，在上一个页面赋值的
    const isMatch = app.globalData.isMatch;
    if(isMatch != null && isMatch != undefined) {
      this.setData({
        isMatch: isMatch
      });
    };
    if(typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3
      });
    };
    // 还原全局数据
    app.globalData.isMatch = false;

    let entInfos = wx.getStorageSync('entInfo');
    this.setData({
      entInfo: entInfos,
      tabIndex: 0,
      selectIndex: 0,
      matchPolicyData: [],
      pageNo: 1,
      pageSize: 5
    });
    this.getPolicyLevel();
    this.getMatchPolicyData();
    this.toCheckSubscribe();
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

  closeSubscribe() {
    app.globalData.showSubscribe = false;
    this.setData({
      showSubscribe: false
    });
  },

  toCheckSubscribe() {
    const _this = this;
    // 获取用户的当前设置，判断是否点击了“总是保持以上，不在询问”
    wx.getSetting({
      withSubscriptions: true, // 是否获取用户订阅消息的订阅状态，默认false不返回
      success(res) {
        // 判断用户是否打开消息通知
        if(res.subscriptionsSetting.mainSwitch) {
          //选择总是保持，所以不需要调起授权弹窗
          if(res.subscriptionsSetting.itemSettings != undefined && res.subscriptionsSetting.itemSettings['_F4rhtLijbWqoJFY2OkjUsUl8EMSu90P57_smXSYbSI'] == "accept") {
            app.globalData.showSubscribe = false;
            _this.setData({
              showSubscribe: false
            });
          } else {
            //因为没有选择总是保持，所以需要调起授权弹窗再次授权
            _this.setData({
              showSubscribe: app.globalData.showSubscribe
            });
          };
        } else {
          wx.openSetting({
            withSubscriptions: true
          });
        };
      }
    });
  },
  
  authorizationBtn() {
    const that = this;
    wx.showModal({
      title: '提示',
      content: '是否订阅惠企政策精准推送消息提醒？',
      complete: (res) => {
        if(res.cancel) {
        };
        if(res.confirm) {
          wx.requestSubscribeMessage({
            tmplIds: ['_F4rhtLijbWqoJFY2OkjUsUl8EMSu90P57_smXSYbSI'],
            success(res) {
              if(res['_F4rhtLijbWqoJFY2OkjUsUl8EMSu90P57_smXSYbSI'] == 'accept') {
                wx.showToast({
                  title: '订阅成功！',
                  icon: 'success'
                });
                app.globalData.showSubscribe = false;
              };
              if(res['_F4rhtLijbWqoJFY2OkjUsUl8EMSu90P57_smXSYbSI'] == 'reject') {
                wx.showToast({
                  title: '取消订阅！',
                  icon: 'none'
                });
              };
              that.setData({
                showSubscribe: false
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
  },

  getPolicyLevel() {
    fetch.get('/policy/dict/getLevel').then(res => {
      res.result.unshift('全部');
      let mapObj = {};
      res.result.map((el, index) => {
        mapObj[index] = el;
      });
      this.setData({
        levelList: res.result,
        selectIndexMap: mapObj
      });
    });
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
    this.setData({
      matchPolicyData: [],
      pageNo: 1,
      pageSize: 5
    }, ()=> {
      this.getMatchPolicyData()
    });
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
      this.getMatchPolicyData();
    });
  },
  
  getMatchPolicyData() {
    wx.showLoading({
      title: '加载中',
    });
    const policyLevel = this.data.selectIndexMap[this.data.selectIndex];
    const params = {
      entId: this.data.entInfo.id,
      listType: this.data.tabIndex,
      policyLevel: policyLevel == "全部" ? null : policyLevel,
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize
    };
    let url = '/policy/push/mobile/pushList';
    if(this.data.isMatch) url = '/policy/calculator/matchingResultPageList';
    fetch.post(url, params).then(res => {
      this.setData({
        declareMoney: res.result.declareMoney,
        declarePolicyCount: res.result.declarePolicyCount,
        allDeclarePolicyCount: res.result.allDeclarePolicyCount,
        matchPolicyData: this.data.pageNo > 1 ? this.data.matchPolicyData.concat(res.result.pageList.records) : res.result.pageList.records,
        nomore: res.result.pageList.current >= res.result.pageList.pages ? true : false
      }, () => {
        wx.hideLoading();
      });
    });
  },

  backlast() {
    wx.switchTab({
      url: '/pages/policyCounter/policyCounter',
    });
  },

  changeTabs(e) {
    this.setData({
      tabIndex: e.currentTarget.dataset.tabindex,
      selectIndex: 0,
      pageNo: 1,
      pageSize: 5,
      matchPolicyData: [],
      index: 5
    }, () => {
      this.getMatchPolicyData();
    });
  },

  changeSelect(e) {
    this.setData({
      selectIndex: e.currentTarget.dataset.selectindex,
      pageNo: 1,
      pageSize: 5,
      matchPolicyData: [],
      index: 5
    }, () => {
      this.getMatchPolicyData();
    });
  },

  toMatchDetail(e) {
    wx.navigateTo({
      url: '/pages/subpages/pages/policyMatchDetail/policyMatchDetail?isMatch=' + this.data.isMatch + '&notStore=false&policyId=' + e.currentTarget.dataset.policyid,
    })
  },

  toCompleteInfo() {
    wx.navigateTo({
      url: '/pages/subpages/pages/completeEnterprise/completeEnterprise?flag=3&completeTitle=true&isMatch=' + this.data.isMatch,
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})