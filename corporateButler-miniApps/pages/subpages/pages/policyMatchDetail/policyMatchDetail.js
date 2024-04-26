// pages/subpages/pages/policyMatchDetail/policyMatchDetail.js
const app = getApp();
import { baseUrl, fetch } from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
    entInfo: {},
    policyId: '',
    isMatch: false, //  true 是智能匹配进入，false 是精准推送进入
    notStore: true,
    prevPage: null,
    isShare: false,
    visible: false,
    popLabel: '',
    conditionPkId: '',
    messageTab: 1,
    fullStart: 0,
    halfStart: 0,
    noStart: 0,
    policyDetails: {
      collectFlag: '0',
      policyTitle: '',
      policyContent: '',
      policyDescription: '',
      labelList: [],

      publicityOrgCode: '',
      policyType: '',
      publicityTime: '',
      declareMoney: '',
      declareStartDate: '',
      declareEndDate: '',
    },
    showConditionVOList: [],
    conditionList: [],
    // 模拟数据
    listData: [],
    entFieldName: '',
    entFieldType: '',
    manageFlag: null,
    conditionValue: '',
    conditionPickerValue: '',
    conditionOption: [],
    region: [],
    typeIndex: 0,
    pickerIndex: 0,

    orgSurperList: [],
    orgSurperArr: [],

    entSizeOption: [],  //  企业规模--选项列表
    entTypeOptions: [],  //  企业类型--选项列表
    tradeOptions: [],  //  所属行业--选项列表

    qualificationsHonorOptions: [], //  资质荣誉--选项列表
    organizationOptions: [], //  机构设置--选项列表
    tradeLicenseOptions: [], //  行业许可--选项列表
    certificateOptions: [], //  质量认证--选项列表

    // 字典映射
    entSizeMap: {}, //  企业规模
    entTypeMap: {}, //  企业类型
    tradeMap: {},  //  所属行业
    qualificationsHonorMap: {}, //  资质荣誉
    organizationMap: {}, //  机构设置
    tradeLicenseMap: {}, //  行业许可
    certificateMap: {}, //  质量认证

    toView: '',
    policyCss: {
      '政策层级': 'policy_leave_css',
      '政策类型': 'policy_type_css',
      '产业类型': 'production_type_css',
      '申报类型': 'push_type_css',
      '行业分类': 'industry_info_css',
      '政策对象': 'policy_object_css',
      '政策主题': 'policy_theme_css'
    },

    relationVisible: false,
    relationlabel: '',
    relationlist: [],

    thisPage: true,
    copyVisible: false,
    copyUrl: ''
  },

  changeExpend(e) {
    const idx = e.currentTarget.dataset.index;
    let showConditionVOList = this.data.showConditionVOList;
    showConditionVOList[idx].isExpend = !this.data.showConditionVOList[idx].isExpend;
    this.setData({ showConditionVOList });
  },

  compareProperty(property) {
    return function(a, b) {
      let value1 = a[property];
      let value2 = b[property];
      return value1 - value2;
    };
  },

  getData(str) {
    wx.showLoading({
      title: '加载中',
    });
    let params = { policyId: this.data.policyId };
    let url = '/policy/base/view';
    if(this.data.isMatch) {
      url = '/policy/calculator/matchingResultView';
      params.entId = this.data.entInfo.id;
    };
    params.type = str == 'once' ? '1' : '0';
    fetch.get(url, params).then(res => {
      res.result.publicityTime = res.result.publicityTime ? res.result.publicityTime.split(' ')[0] : null;
      res.result.declareStartDate = res.result.declareStartDate ? res.result.declareStartDate.split(' ')[0] : null;
      res.result.declareEndDate = res.result.declareEndDate ? res.result.declareEndDate.split(' ')[0] : null;

      let list = [];
      if(res.result.policySource == 1 && res.result.policyAttachment != '' && res.result.policyAttachment != null) {
        fetch.get('/sys/common/getTemporaryPath', { filePath: res.result.policyAttachment }).then(data => {
          let obj = {
            title: res.result.policyAttachment.split('policyBase/')[1],
            sourceLink: baseUrl.replace('/jeecgboot', '') + data.result
          }
          list.push(obj);
          this.setData({
            listData: list
          }, () => {
            wx.hideLoading();
          });
        });
      } else if(res.result.policyAttachment == null || res.result.policyAttachment == '') {
        list = [];
      } else {
        list = JSON.parse(res.result.policyAttachment);
      };
      if(res.result.policySource == 0 && res.result.policyContent != '' && res.result.policyContent != null) res.result.policyContent = res.result.policyContent.replaceAll('<br/>', '\n');
      if(res.result.conditionList) res.result.conditionList.map(el => el.isExpend = false );
      this.setData({
        policyDetails: res.result,
        listData: list.filter(el => el.sourceLink),
        showConditionVOList: res.result.conditionList || []
      }, () => {
        wx.hideLoading();
      });
      if(this.data.isMatch) {
        this.setData({
          fullStart: Math.floor(res.result.policyStarScore/2),
          halfStart: res.result.policyStarScore % 2,
          noStart: Math.floor((10 - res.result.policyStarScore)/2),
          conditionList: res.result.conditionList
        });
      };
    });
  },

  handleCollect() {
    fetch.get('/policy/mobile/collect', {policyId: this.data.policyId}).then(res => {
      if(res.result) {
        wx.showToast({
          title: res.message,
          icon: 'none'
        });
        setTimeout(() => {
          this.getData();
        }, 1000);
      };
    });
  },
  
  onRelationVisibleChange(e) {
    this.setData({
      relationVisible: e.detail.visible,
      relationlabel: '',
      relationlist: []
    });
  },

  onCopyVisibleChange(e) {
    this.setData({
      copyVisible: e.detail.visible,
      copyUrl: ''
    });
  },

  openRelationPopup(e) {
    this.setData({
      relationVisible: true,
      relationlabel: e.currentTarget.dataset.relationlabel,
      relationlist: e.currentTarget.dataset.relationlist
    });
  },

  onVisibleChange(e) {
    this.setData({
      visible: e.detail.visible
    });
  },

  handlePopup(e) {
    const types = e.currentTarget.dataset.type;
    const names = e.currentTarget.dataset.name;
    const manageFlag = e.currentTarget.dataset.manageflag;
    let typeIndex = 0, pickerIndex = 0;
    if(types == 'number') {
      typeIndex = 1;
    } else if(types == 'date') {
      typeIndex = 2;
    } else if(types == 'address') {
      typeIndex = 3;
    } else if(types == 'select') {
      switch(names) {
        case 'entScale':
          typeIndex = 4;
          pickerIndex = 1;
          this.setData({
            conditionOption: this.data.entSizeOption
          });
          break;
        case 'entType':
          typeIndex = 4;
          pickerIndex = 2;
          this.setData({
            conditionOption: this.data.entTypeOptions
          });
          break;
        case 'trade':
          typeIndex = 4;
          pickerIndex = 3;
          this.setData({
            conditionOption: this.data.tradeOptions
          });
          break;
        case 'certificate':
          typeIndex = 5;
          pickerIndex = 4;
          this.data.qualificationsHonorOptions.map(el => el.checked = false);
          this.setData({
            conditionOption: this.data.qualificationsHonorOptions
          });
          break;
        case 'orgSetting':
          typeIndex = 5;
          pickerIndex = 5;
          this.data.organizationOptions.map(el => el.checked = false);
          this.setData({
            orgSurperArr: [],
            orgSurperList: [],
            conditionOption: this.data.organizationOptions
          });
          break;
        case 'allow':
          typeIndex = 5;
          pickerIndex = 6;
          this.data.tradeLicenseOptions.map(el => el.checked = false);
          this.setData({
            conditionOption: this.data.tradeLicenseOptions
          });
          break;
        case 'standard':
          typeIndex = 5;
          pickerIndex = 7;
          this.data.certificateOptions.map(el => el.checked = false);
          this.setData({
            conditionOption: this.data.certificateOptions
          });
          break;
        default:
          break;
      };
    };
    this.setData({
      popLabel: e.currentTarget.dataset.label,
      conditionPkId: e.currentTarget.dataset.pkid,
      entFieldName: names,
      entFieldType: types,
      conditionValue: '',
      conditionPickerValue: '',
      manageFlag: manageFlag,
      typeIndex: typeIndex,
      pickerIndex: pickerIndex
    }, () => {
      this.setData({ visible: true });
    });
  },

  popInputBlur(e) {
    this.setData({
      conditionValue: e.detail.value
    });
  },

  bindRegisterDateChange(e) {
    this.setData({
      conditionValue: e.detail.value
    });
  },

  bindRegionChange(e) {
    this.setData({
      region: e.detail.value,
      conditionValue: e.detail.code[2]
    })
  },

  bindPickerChange(e) {
    const names = this.data.entFieldName;
    if(names == 'entScale') {
      this.setData({
        conditionPickerValue: e.detail.value,
        conditionValue: this.data.entSizeMap[this.data.entSizeOption[e.detail.value]]
      });
    } else if(names == 'entType') {
      this.setData({
        conditionPickerValue: e.detail.value,
        conditionValue: this.data.entTypeMap[this.data.entTypeOptions[e.detail.value]]
      });
    } else if(names == 'trade') {
      this.setData({
        conditionPickerValue: e.detail.value,
        conditionValue: this.data.tradeMap[this.data.tradeOptions[e.detail.value]]
      });
    };
  },
  
  // Tag标签选中事件
  handleTagCheck(e) {
    let list = [], orgSurperList = [];
    const itemindex = e.currentTarget.dataset.itemindex;
    list = this.data.conditionOption;
    list[itemindex].checked = e.detail.checked;
    let confirmList = '';
    if(this.data.entFieldName == 'orgSetting') {
      list.map(el => { 
        if(el.checked) {
          if(el.value == 'a' || el.value == 'c' ) {
            orgSurperList.push({
              area: '',
              finance: '',
              entNum: '',
              graduateEntNum: '',
              value: el.value 
            });
          } else if(el.value == 'b') {
            orgSurperList.push({ 
              area: '',
              finance: '',
              servicerNum: '',
              value: el.value 
            });
          } else {
            orgSurperList.push({ value: el.value });
          };
        };
      });
    } else {
      list.map(el => { 
        if(el.checked) confirmList += ',' + el.value; 
      });
    };
    let submitValues = this.data.entFieldName == 'orgSetting' ? JSON.stringify(orgSurperList) : confirmList.slice(1);
    this.setData({
      conditionOption: list,
      conditionValue: submitValues,
      orgSurperList,
      orgSurperArr: orgSurperList.filter(el => el.value == 'a' || el.value == 'b' || el.value == 'c')
    });
  },

  //  特殊处理机构
  popSurperInputBlur(e) {
    let label = e.currentTarget.dataset.label;
    let values = e.currentTarget.dataset.value;
    let list = this.data.orgSurperList;
    list.map(el => {
      if(el.value == values) {
        el[label] = e.detail.value
      };
    });
    this.setData({
      orgSurperList: list,
      orgSurperArr: list.filter(el => el.value == 'a' || el.value == 'b' || el.value == 'c'),
      conditionValue: JSON.stringify(list)
    });
  },

  //  获取所有字典
  getAllDictItems() {
    wx.showLoading({
      title: '加载中',
    });
    fetch.get('/enterprise/entInfo/getManyDictItems?dictCodeList=ent_info_hyxk,ent_info_yqryrz,ent_info_qyxsjg,ent_info_zlbzrz,ent_info_qylx,ent_info_sshy,ent_info_qygm').then(res => {
      res.result.ent_info_yqryrz.forEach(el => el.checked = false);
      res.result.ent_info_qyxsjg.forEach(el => el.checked = false);
      res.result.ent_info_hyxk.forEach(el => el.checked = false);
      res.result.ent_info_zlbzrz.forEach(el => el.checked = false);
      this.setData({
        entSizeMap: this.dealDictItemsMap(res.result.ent_info_qygm),
        entSizeOption: res.result.ent_info_qygm.map(el => el.title),
        entTypeMap: this.dealDictItemsMap(res.result.ent_info_qylx),
        entTypeOptions: res.result.ent_info_qylx.map(el => el.title),
        tradeMap: this.dealDictItemsMap(res.result.ent_info_sshy),
        tradeOptions: res.result.ent_info_sshy.map(el => el.title),
        qualificationsHonorMap: this.dealDictItemsMap(res.result.ent_info_yqryrz),
        qualificationsHonorOptions: res.result.ent_info_yqryrz,
        organizationMap: this.dealDictItemsMap(res.result.ent_info_qyxsjg),
        organizationOptions: res.result.ent_info_qyxsjg,
        tradeLicenseMap: this.dealDictItemsMap(res.result.ent_info_hyxk),
        tradeLicenseOptions: res.result.ent_info_hyxk,
        certificateMap: this.dealDictItemsMap(res.result.ent_info_zlbzrz),
        certificateOptions: res.result.ent_info_zlbzrz,
      }, () => {
        wx.hideLoading();
      });
    });
  },

  // 处理字典为map映射关系
  dealDictItemsMap(data) {
    let mapObj = {};
    data.map(el => {
      mapObj[el.title] = el.value;
    });
    return mapObj;
  },

  findKey(obj, value, compare = (a, b) => a === b) {
    return Object.keys(obj).find(k => compare(obj[k], value));
  },

  handlePopCencel() {
    this.setData({
      visible: false
    });
  },

  handlePopConfirm() {
    wx.showLoading({
      title: '加载中',
    });
    const params = {
      policyId: this.data.policyId,
      conditionPkId: this.data.conditionPkId,
      entId: this.data.entInfo.id,
      entFieldName: this.data.entFieldName,
      entFieldType: this.data.entFieldType,
      conditionValue: this.data.conditionValue,
      manageFlag: this.data.manageFlag
    };
    fetch.post('/policy/calculator/conditionEdit', params).then(res => {
      wx.showToast({
        title: res.message,
        icon: 'none',
        duration: 2000
      });
      this.setData({
        visible: false,
        conditionValue: ''
      }, () => {
        setTimeout(() => {
          wx.hideLoading();
          wx.hideToast();
          this.getData('once');
        }, 2000);
      });
    });
  },

  // 点击事件
  previewSqs(event) {
    // 拿到图片的地址url
    let currentUrl = event.currentTarget.dataset.src;
    let imgList = []; //定义一个放图片的数组
    // 循环模拟数据的数组取其中的图片字段，将其添加到imgList数组中
    for(let i = 0; i < this.data.listData.length; i++) {
        imgList.push(this.data.listData[i].sourceLink);
    };
    // 调用微信小程序预览图片的方法
    wx.previewImage({
        current: currentUrl, // 当前显示图片的http链接
        urls: imgList // 需要预览的图片http链接列表
    });
  },

  //  文档预览
  previewDoc(event) {
    wx.showLoading({
      title: '文件加载中',
    });
    const that = this;
    // 拿到文件的地址url
    let currentUrl = event.currentTarget.dataset.src;
    if(currentUrl == '') return
    let fileType = null, file = null;
    const str = currentUrl.split('policyBase/')[1];
    if(str) {
      const index = str.lastIndexOf("\?");
      file = str.substring(0, index);
      if(file.endsWith('.doc')) {
        fileType = 'doc';
      } else if(file.endsWith('.docx')) {
        fileType = 'docx';
      } else if(file.endsWith('.xls')) {
        fileType = 'xls';
      } else if(file.endsWith('.xlsx')) {
        fileType = 'xlsx';
      } else if(file.endsWith('.ppt')) {
        fileType = 'ppt';
      } else if(file.endsWith('.pptx')) {
        fileType = 'pptx';
      } else if(file.endsWith('.pdf')) {
        fileType = 'pdf';
      };
    } else {
      file = currentUrl;
      if(file.includes('.doc')) {
        fileType = 'doc';
      } else if(file.includes('.docx')) {
        fileType = 'docx';
      } else if(file.includes('.xls')) {
        fileType = 'xls';
      } else if(file.includes('.xlsx')) {
        fileType = 'xlsx';
      } else if(file.includes('.ppt')) {
        fileType = 'ppt';
      } else if(file.includes('.pptx')) {
        fileType = 'pptx';
      } else if(file.includes('.pdf')) {
        fileType = 'pdf';
      };
    };
    if(fileType) {
      wx.downloadFile({
        url: currentUrl,
        success: function (res) {
          wx.hideLoading();
          if(!that.data.thisPage) return
          const filePath = res.tempFilePath
          wx.openDocument({
            filePath: filePath,
            fileType,
            showMenu: true,
            success: function (res) {
            }
          });
        }
      });
    } else {
      wx.previewMedia({
        sources:[{ type:"image", url: currentUrl }]
      });
    };
  },

  //  复制链接引导用户去浏览器打开
  openToCopy(e) {
    // 拿到文件的地址url
    let currentUrl = e.currentTarget.dataset.src;
    console.log(currentUrl)
    this.setData({
      copyVisible: true,
      copyUrl: currentUrl
    });
  },

  closeCopy() {
    this.setData({
      copyVisible: false
    });
  },

  toCopy() {
    const that = this;
    wx.setClipboardData({
      data: this.data.copyUrl,
      success (res) {
        that.setData({
          copyVisible: false
        });
      }
    });
  },

  toScrollView(e) {
    // console.log(e.detail.scrollTop);
    // if(e.detail.scrollTop > 120) {
    //   if(this.data.messageTab == 2) return;
    //   this.setData({
    //     messageTab: 2
    //   });
    // } else if(e.detail.scrollTop < 120) {
    //   if(this.data.messageTab == 1) return;
    //   this.setData({
    //     messageTab: 1
    //   });
    // };
  },

  toScrollTop() {
    if(this.data.messageTab == 1) return;
    this.setData({
      messageTab: 1
    });
  },

  toScrollBottom() {
    if(this.data.messageTab == 3) return;
    this.setData({
      messageTab: 3
    });
  },

  clickToShow(e) {
    const index = e.currentTarget.dataset.index;
    const id = e.currentTarget.dataset.id;
    this.setData({
      toView: id,
      messageTab: index
    });
    // const query = wx.createSelectorQuery();
    // query.select('#the-id').boundingClientRect();
    // query.selectViewport().scrollOffset();
    // query.exec(function(res) {
    //   res[1].scrollTop       // #the-id节点的上边界坐标
    //   res[1].scrollTop // 显示区域的竖直滚动位置
    // });

    // this.setData({
    //   messageTab: index
    // });
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
    this.setData({
      policyId: options.policyId || '',
      prevPagePath: options.prevPagePath ? options.prevPagePath : null,
      isShare: options.isShare ? JSON.parse(options.isShare) : false,
      isMatch: options.isMatch ? JSON.parse(options.isMatch) : false,
      notStore: options.notStore ? JSON.parse(options.notStore) : true,
      thisPage: true
    }, () => {
      this.getData();
      this.getAllDictItems();
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // 监听页面是否滚动到元素
    // let observer1 = wx.createIntersectionObserver();
    // observer1.relativeToViewport().observe('#detail', (res) => {
    //     if (res.intersectionRatio > 0) {
    //       this.setData({
    //         messageTab: 2
    //       });
    //     } else {
    //       this.setData({
    //         messageTab: 1
    //       });
    //     };
    // });

    // let observer2 = wx.createIntersectionObserver();
    // observer2.relativeToViewport().observe('#annex', (res) => {
    //     if (res.intersectionRatio > 0) {
    //       this.setData({
    //         messageTab: 3
    //       });
    //     } else {
    //       this.setData({
    //         messageTab: 2
    //       });
    //     };
    // });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const entInfo = wx.getStorageSync('entInfo');
    this.setData({
      entInfo: entInfo
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    this.setData({
      thisPage: false
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    this.setData({
      thisPage: false
    });
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
    fetch.get('/policy/mobile/share', { policyId: this.data.policyId }).then(res => {})
    return {
      title: '政策详情',
      path: '/pages/subpages/pages/policyMatchDetail/policyMatchDetail?policyId=' + this.data.policyId + '&isMatch=' + this.data.isMatch + '&notStore=' + this.data.notStore + '&isShare=true'
    }
  }
})