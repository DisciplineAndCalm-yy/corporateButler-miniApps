// pages/subPagesForEcharts/pages/entAndPersonInfo/entAndPersonInfo.js
const app = getApp();
import { fetch } from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
    isMine: false,  //  true 是我的进入，false  精准推送进入
    isMatch: false, //  true 是智能匹配进入，false 是精准推送进入
    infotabIndex: 0,

    personList: [],
    pageSize: 5,
    pageNo: 1,
    nomore: false,

    topTabIndex: 1,
    isEdit: false,  //  是否编辑
    echoEntInfo: {},  //  回显信息大map
    entId: '',
    // 企业基本信息
    entCode: '',  //  企业信用代码
    entName: '',  //  企业名称
    registerDate: '', //  注册时间
    region: [], //  注册地址
    regionCode: '', //  注册地址Code--PC端回显用
    entAdress: '',  //  企业详细地址
    entSize: '',  //  企业规模
    entSizeOption: [],  //  企业规模--选项列表
    entType: '', //  企业类型
    entTypeOptions: [],  //  企业类型--选项列表
    industry: '', //  所属行业
    industryOptions: [],  //  所属行业--选项列表
    switchGisChecked: false, //  经纬度开关
    longitude: '',  //  经度
    latitude: '', //  纬度
    // 企业人员信息
    entTotalPeople: '', //  企业总人数
    entJuniorCollegePeople: '', //  大专以上人数
    entCollegePeople: '', //  本科以上人数
    entMasterPeople: '', //  硕士以上人数
    entDoctorPeople: '', //  博士人数
    entSeniorProfessionalPeople: '', //  高级职称人数
    entIntermediatePeople: '', //  中级职称人数
    entScientificPeople: '', //  科研人员人数
    entDevelopPeople: '',  //  研发人数
    // 企业营收情况
    crumbsIndex: 3,
    nowYear: '',  //  今年
    pastThreeYears: '', //  近三年
    pastTwoYears: '', //  近两年
    lastYears: '', //  去年
    listedOptions: ['未上市', '已上市'],  //  上市情况选项  ，未上市-0, 已上市-1
    //  近三年
    hasPastThreeYearData: false,
    pastThreeOperatingRevenue: '',  //  近三年营业收入
    pastThreeMainOperatingRevenue: '',  //  近三年主营业务收入
    pastThreeListed: '', //  上市情况
    pastThreeEntFinancingMoney: '',  //  近三年企业融资金额
    pastThreeRAndDMoney: '',  //  近三年研发投入
    //  近两年
    hasPastTwoYearData: false,
    pastTwoOperatingRevenue: '',  //  近两年营业收入
    pastTwoMainOperatingRevenue: '',  //  近两年主营业务收入
    pastTwoListed: '', //  上市情况
    pastTwoEntFinancingMoney: '',  //  近两年企业融资金额
    pastTwoRAndDMoney: '',  //  近两年研发投入
    //  去年
    hasLastYearData: false,
    lastOperatingRevenue: '',  //  去年营业收入
    lastMainOperatingRevenue: '',  //  去年主营业务收入
    lastListed: '', //  上市情况
    lastEntFinancingMoney: '',  //  去年企业融资金额
    lastRAndDMoney: '',  //  去年研发投入
    // 企业知识产权
    intellectualPropertyTotalNum: '', //  知识产权总数
    intellectualPropertyOneNum: '', //  一类知识产权数
    intellectualPropertyTwoNum: '', //  二类知识产权数
    patentNum: '', //  专利总数
    trademarkNum: '', //  注册商标总数
    copyrightsNum: '', //  软件著作权总数
    PTCNum: '', //  国际专利（PTC）数
    // 其他
    popIndex: '', // 1--资质荣誉，2--机构设置，3--行业许可，4--质量认证
    visible: false, //  弹出层
    qualificationsHonorOptions: [], //  资质荣誉--选项列表
    qualificationsHonorValue: [], // 资质荣誉--选项值
    organizationOptions: [], //  机构设置--选项列表
    organizationValue: [], // 机构设置--选项值
    industryLicenseOptions: [], //  行业许可--选项列表
    industryLicenseValue: [], // 行业许可--选项值
    certificateOptions: [], //  质量认证--选项列表
    certificateValue: [], // 质量认证--选项值
    showMoreEl1: false, //  科技企业孵化器--额外内容
    showMoreEl2: false, //  众创空间--额外内容
    showMoreEl3: false, //  公共服务示范平台--额外内容
    //  科技企业孵化器
    scienceSiteArea: '',  //  场地面积
    scienceMoney: '',  //  资金规模
    scienceHatch: '',  //  在孵企业
    scienceGraduate: '',  //  累计毕业企业
    //  众创空间
    spaceSiteArea: '',  //  场地面积
    spaceMoney: '',  //  资金规模
    spaceWaiter: '',  //  专业服务人员
    //  公共服务示范平台
    publicSiteArea: '',  //  场地面积
    publicMoney: '',  //  资金规模
    publicHatch: '',  //  在孵企业
    publicGraduate: '',  //  累计毕业企业

    // 字典映射
    entSizeMap: {}, //  企业规模
    entTypeMap: {}, //  企业类型
    industryMap: {},  //  所属行业
    qualificationsHonorMap: {}, //  资质荣誉
    organizationMap: {}, //  机构设置
    industryLicenseMap: {}, //  行业许可
    certificateMap: {}, //  质量认证
  },

  handleInfoTab(e) {
    this.setData({
      infotabIndex: e.currentTarget.dataset.id
    });
  },

  //  更改填写进度条
  changeTopTab(e) {
    this.setData({
      topTabIndex: e.currentTarget.dataset.index
    });
  },

  //  企业基本信息
  //  企业信用代码
  entCodeInput(e) {
    this.setData({
      entCode: e.detail.value
    }, () => {
      this.getEntInfo();
    });
  },
 
  //  企业名称
  entNameInput(e) {
    this.setData({
      entName: e.detail.value
    });
  },
  
  // 注册时间
  bindRegisterDateChange(e) {
    this.setData({
      registerDate: e.detail.value
    })
  },

  //  注册地址
  bindRegionChange(e) {
    this.setData({
      region: e.detail.value,
      regionCode: e.detail.code[2]
    })
  },

  //  企业详细地址
  entadressInput(e) {
    this.setData({
      entAdress: e.detail.value
    });
  },
  
  // 企业规模
  bindEntSizePickerChange(e) {
    this.setData({
      entSize: e.detail.value
    })
  },

  // 企业类型
  bindEntTypePickerChange(e) {
    this.setData({
      entType: e.detail.value
    })
  },

  // 所属行业
  bindIndustryPickerChange(e) {
    this.setData({
      industry: e.detail.value
    })
  },
  
  //  经纬度开关
  switchGisChange(e) {
    if(e.detail.value) {
      const that = this;
      wx.getLocation({
        type: 'wgs84',
        success (res) {
          that.setData({
            switchGisChecked: e.detail.value,
            longitude: res.longitude,
            latitude: res.latitude
          })
        }
      });
    } else {
      this.setData({
        switchGisChecked: e.detail.value,
        longitude: '',
        latitude: ''
      });
    };
  },

  //  企业人员信息
  //  企业总人数
  entTotalPeopleInput(e) {
    this.setData({
      entTotalPeople: e.detail.value
    });
  },
 
  //  大专以上
  entJuniorCollegePeopleInput(e) {
    this.setData({
      entJuniorCollegePeople: e.detail.value
    });
  },
 
  //  本科以上
  entCollegePeopleInput(e) {
    this.setData({
      entCollegePeople: e.detail.value
    });
  },
 
  //  硕士以上
  entMasterPeopleInput(e) {
    this.setData({
      entMasterPeople: e.detail.value
    });
  },
 
  //  博士
  entDoctorPeopleInput(e) {
    this.setData({
      entDoctorPeople: e.detail.value
    });
  },
 
  //  高级职称
  entSeniorProfessionalPeopleInput(e) {
    this.setData({
      entSeniorProfessionalPeople: e.detail.value
    });
  },
 
  //  中级职称
  entIntermediatePeopleInput(e) {
    this.setData({
      entIntermediatePeople: e.detail.value
    });
  },
 
  //  科研人员
  entScientificPeopleInput(e) {
    this.setData({
      entScientificPeople: e.detail.value
    });
  },

  //  研发人员
  entDevelopPeopleInput(e) {
    this.setData({
      entDevelopPeople: e.detail.value
    });
  },
 
  //  企业营收情况
  //  经营情况切换年份
  handleChangeCrumbs(e) {
    this.setData({
      crumbsIndex: e.currentTarget.dataset.index
    });
  },

  //  近三年
  //  营业收入
  pastThreeOperatingRevenueInput(e) {
    this.setData({
      pastThreeOperatingRevenue: e.detail.value,
      hasPastThreeYearData: true
    })
  },

  //  主营业务收入
  pastThreeMainOperatingRevenueInput(e) {
    this.setData({
      pastThreeMainOperatingRevenue: e.detail.value
    })
  },

  //  上市情况
  bindPastThreeListedPickerChange(e) {
    this.setData({
      pastThreeListed: e.detail.value
    })
  },

  //  企业融资金额
  pastThreeEntFinancingMoneyInput(e) {
    this.setData({
      pastThreeEntFinancingMoney: e.detail.value
    })
  },

  //  研发投入
  pastThreeRAndDMoneyInput(e) {
    this.setData({
      pastThreeRAndDMoney: e.detail.value
    })
  },

  //  近两年
  //  营业收入
  pastTwoOperatingRevenueInput(e) {
    this.setData({
      pastTwoOperatingRevenue: e.detail.value,
      hasPastTwoYearData: true
    })
  },

  //  主营业务收入
  pastTwoMainOperatingRevenueInput(e) {
    this.setData({
      pastTwoMainOperatingRevenue: e.detail.value
    })
  },

  //  上市情况
  bindPastTwoListedPickerChange(e) {
    this.setData({
      pastTwoListed: e.detail.value
    })
  },

  //  企业融资金额
  pastTwoEntFinancingMoneyInput(e) {
    this.setData({
      pastTwoEntFinancingMoney: e.detail.value
    })
  },

  //  研发投入
  pastTwoRAndDMoneyInput(e) {
    this.setData({
      pastTwoRAndDMoney: e.detail.value
    })
  },

  //  去年
  //  营业收入
  lastOperatingRevenueInput(e) {
    this.setData({
      lastOperatingRevenue: e.detail.value,
      hasLastYearData: true
    })
  },

  //  主营业务收入
  lastMainOperatingRevenueInput(e) {
    this.setData({
      lastMainOperatingRevenue: e.detail.value
    })
  },

  //  上市情况
  bindlastListedPickerChange(e) {
    this.setData({
      lastListed: e.detail.value
    })
  },

  //  企业融资金额
  lastEntFinancingMoneyInput(e) {
    this.setData({
      lastEntFinancingMoney: e.detail.value
    })
  },

  //  研发投入
  lastRAndDMoneyInput(e) {
    this.setData({
      lastRAndDMoney: e.detail.value
    })
  },

  //  企业知识产权
  //  知识产权总数
  intellectualPropertyTotalNumInput(e) {
    this.setData({
      intellectualPropertyTotalNum: e.detail.value
    })
  },

  //  一类知识产权数
  intellectualPropertyOneNumInput(e) {
    this.setData({
      intellectualPropertyOneNum: e.detail.value
    })
  },

  //  二类知识产权数
  intellectualPropertyTwoNumInput(e) {
    this.setData({
      intellectualPropertyTwoNum: e.detail.value
    })
  },

  //  专利总数
  patentNumInput(e) {
    this.setData({
      patentNum: e.detail.value
    })
  },

  //  注册商标总数
  trademarkNumInput(e) {
    this.setData({
      trademarkNum: e.detail.value
    })
  },

  //  软件著作权总数
  copyrightsNumInput(e) {
    this.setData({
      copyrightsNum: e.detail.value
    })
  },

  //  国际专利（PTC）数
  PTCNumInput(e) {
    this.setData({
      PTCNum: e.detail.value
    })
  },

  //  其他信息
  // 科技企业孵化器
  //  场地面积
  scienceSiteAreaInput(e) {
    this.setData({
      scienceSiteArea: e.detail.value
    });
  },

  //  资金规模
  scienceMoneyInput(e) {
    this.setData({
      scienceMoney: e.detail.value
    });
  },

  //  在孵企业
  scienceHatchInput(e) {
    this.setData({
      scienceHatch: e.detail.value
    });
  },

  //  累计毕业企业
  scienceGraduateInput(e) {
    this.setData({
      scienceGraduate: e.detail.value
    });
  },

  // 众创空间
  //  场地面积
  spaceSiteAreaInput(e) {
    this.setData({
      spaceSiteArea: e.detail.value
    });
  },

  //  资金规模
  spaceMoneyInput(e) {
    this.setData({
      spaceMoney: e.detail.value
    });
  },

  //  专业服务人员
  spaceWaiterInput(e) {
    this.setData({
      spaceWaiter: e.detail.value
    });
  },

  // 公共服务示范平台
  //  场地面积
  publicSiteAreaInput(e) {
    this.setData({
      publicSiteArea: e.detail.value
    });
  },

  //  资金规模
  publicMoneyInput(e) {
    this.setData({
      publicMoney: e.detail.value
    });
  },

  //  在孵企业
  publicHatchInput(e) {
    this.setData({
      publicHatch: e.detail.value
    });
  },

  //  累计毕业企业
  publicGraduateInput(e) {
    this.setData({
      publicGraduate: e.detail.value
    });
  },


  // 弹出层
  onVisibleChange(e) {
    this.setData({
      visible: e.detail.visible
    });
  },

  //  点击打开
  handlePopup(e) {
    this.setData({
      popIndex: e.currentTarget.dataset.popindex
    }, () => {
      this.setData({ visible: true });
    });
  },

  // Tag标签选中事件
  handleTagCheck(e) {
    let list = [];
    const popidx = this.data.popIndex;
    const itemindex = e.currentTarget.dataset.itemindex;
    switch(popidx) {
      case '1':
        list = this.data.qualificationsHonorOptions;
        list[itemindex].checked = e.detail.checked;
        this.setData({ qualificationsHonorOptions: list })
        break;
      case '2':
        list = this.data.organizationOptions;
        list[itemindex].checked = e.detail.checked;
        this.setData({ organizationOptions: list })
        break;
      case '3':
        list = this.data.industryLicenseOptions;
        list[itemindex].checked = e.detail.checked;
        this.setData({ industryLicenseOptions: list })
        break;
      case '4':
        list = this.data.certificateOptions;
        list[itemindex].checked = e.detail.checked;
        this.setData({ certificateOptions: list })
        break;
      default:
        break;
    };
  },

  // Tag标签回显选中事件
  handleBackTagCheck(arr, id) {
    let list = [];
    switch(id) {
      case '1':
        list = this.data.qualificationsHonorOptions;
        arr.map(el => {
          list.forEach(item => {
            if(item.value == el) item.checked = true;
          });
        });
        this.setData({ qualificationsHonorOptions: list })
        break;
      case '2':
        list = this.data.organizationOptions;
        arr.map(el => {
          list.forEach(item => {
            if(item.value == el) item.checked = true;
          });
        });
        let { showMoreEl1, showMoreEl2, showMoreEl3 } = this.data;
        // 特别判断
        showMoreEl1 = arr.findIndex(el => el == 'a') != -1 ? true : false;
        showMoreEl2 = arr.findIndex(el => el == 'b') != -1 ? true : false;
        showMoreEl3 = arr.findIndex(el => el == 'c') != -1 ? true : false;
        this.setData({ 
          organizationOptions: list,
          showMoreEl1: showMoreEl1,
          showMoreEl2: showMoreEl2,
          showMoreEl3: showMoreEl3
        })
        break;
      case '3':
        list = this.data.industryLicenseOptions;
        arr.map(el => {
          list.forEach(item => {
            if(item.value == el) item.checked = true;
          });
        });
        this.setData({ industryLicenseOptions: list })
        break;
      case '4':
        list = this.data.certificateOptions;
        arr.map(el => {
          list.forEach(item => {
            if(item.value == el) item.checked = true;
          });
        });
        this.setData({ certificateOptions: list })
        break;
      default:
        break;
    };
  },

  // 弹窗选择事件
  // 取消
  onHandleCencel() {
    this.setData({ visible: false })
  },

  // 确认
  onHandleConfirm() {
    const popidx = this.data.popIndex;
    let list = [];
    switch(popidx) {
      case '1':
        this.data.qualificationsHonorOptions.map(el => { if(el.checked) list.push(el.value); });
        this.setData({ qualificationsHonorValue: list }, () => {
          this.setData({
            visible: false
          });
        });
        break;
      case '2':
        this.data.organizationOptions.map(el => { if(el.checked) list.push(el.value); });
        let { showMoreEl1, showMoreEl2, showMoreEl3 } = this.data;
        // 特别判断
        showMoreEl1 = list.findIndex(el => el == 'a') != -1 ? true : false;
        showMoreEl2 = list.findIndex(el => el == 'b') != -1 ? true : false;
        showMoreEl3 = list.findIndex(el => el == 'c') != -1 ? true : false;
        this.setData({
          organizationValue: list,
          showMoreEl1: showMoreEl1,
          showMoreEl2: showMoreEl2,
          showMoreEl3: showMoreEl3
        }, () => {
          this.setData({
            visible: false
          });
        });
        break;
      case '3':
        this.data.industryLicenseOptions.map(el => { if(el.checked) list.push(el.value); });
        this.setData({ industryLicenseValue: list }, () => {
          this.setData({
            visible: false
          });
        });
        break;
      case '4':
        this.data.certificateOptions.map(el => { if(el.checked) list.push(el.value); });
        this.setData({ certificateValue: list }, () => {
          this.setData({
            visible: false
          });
        });
        break;
      default:
        break;
    };
  },

  //  底部按钮组
  // 上一步
  handleBackStep() {
    this.setData({
      topTabIndex: Number(this.data.topTabIndex) - 1
    });
  },

  // 下一步
  handleNextStep() {
    this.setData({
      topTabIndex: Number(this.data.topTabIndex) + 1
    });
  },
  
  // 完成
  handleFinsh() {
    wx.navigateBack();
  },

  findKey(obj, value, compare = (a, b) => a === b) {
    return Object.keys(obj).find(k => compare(obj[k], value));
  },

  // 数据回显
  toEcho() {
    let newOrgList = [];
    let orgList = JSON.parse(this.data.echoEntInfo.entInfo.orgSetting);
    orgList.forEach(el => {
      newOrgList.push(el.value);
      if(el.value == 'a') {
        this.setData({
          scienceSiteArea: el.area,
          scienceMoney: el.finance,
          scienceHatch: el.entNum,
          scienceGraduate: el.graduateEntNum
        });
      };
      if(el.value == 'b') {
        this.setData({
          spaceSiteArea: el.area,
          spaceMoney: el.finance,
          spaceWaiter: el.servicerNum
        });
      };
      if(el.value == 'c') {
        this.setData({
          publicSiteArea: el.area,
          publicMoney: el.finance,
          publicHatch: el.entNum,
          publicGraduate: el.graduateEntNum
        });
      };
    });

    let manageInfo = this.data.echoEntInfo.infoManages;
    manageInfo.forEach(el => {
      if(el.year == this.data.pastThreeYears) {
        this.setData({
          hasPastThreeYearData: true,
          pastThreeOperatingRevenue: el.businessIncome,
          pastThreeMainOperatingRevenue: el.mainBusinessIncome,
          pastThreeListed: Number(el.ssqk) - 1,
          pastThreeEntFinancingMoney: el.financing,
          pastThreeRAndDMoney: el.developInvest
        });
      };
      if(el.year == this.data.pastTwoYears) {
        this.setData({
          hasPastTwoYearData: true,
          pastTwoOperatingRevenue: el.businessIncome,
          pastTwoMainOperatingRevenue: el.mainBusinessIncome,
          pastTwoListed: Number(el.ssqk) - 1,
          pastTwoEntFinancingMoney: el.financing,
          pastTwoRAndDMoney: el.developInvest
        });
      };
      if(el.year == this.data.lastYears) {
        this.setData({
          hasLastYearData: true,
          lastOperatingRevenue: el.businessIncome,
          lastMainOperatingRevenue: el.mainBusinessIncome,
          lastListed: Number(el.ssqk) - 1,
          lastEntFinancingMoney: el.financing,
          lastRAndDMoney: el.developInvest
        });
      };
    });
    let regionList = this.data.echoEntInfo.regName.split('/');
    regionList[1] = regionList[1] == '市辖区' ? regionList[0] : regionList[1];

    let hasLocation = false, oldLongitude = '', oldLatitude = '';
    if(this.data.echoEntInfo.entInfo.entLocation) {
      hasLocation = true;
      oldLongitude = this.data.echoEntInfo.entInfo.entLocation.split(',')[0];
      oldLatitude = this.data.echoEntInfo.entInfo.entLocation.split(',')[1];
    };

    this.setData({
      entCode: this.data.echoEntInfo.entInfo.creditCode,
      entName: this.data.echoEntInfo.entInfo.entName,
      registerDate: this.data.echoEntInfo.entInfo.estDate,
      regionCode: this.data.echoEntInfo.entInfo.reg,
      region: regionList,
      entSize: this.findKey(this.data.entSizeOption, this.findKey(this.data.entSizeMap, this.data.echoEntInfo.entInfo.entScale)),
      entType: this.data.echoEntInfo.entInfo.entType,
      industry: this.findKey(this.data.industryOptions, this.findKey(this.data.industryMap, this.data.echoEntInfo.entInfo.trade)),
      switchGisChecked: hasLocation,
      longitude: oldLongitude,
      latitude: oldLatitude,
      qualificationsHonorValue: JSON.parse(this.data.echoEntInfo.entInfo.certificate),
      organizationValue: newOrgList,
      industryLicenseValue: JSON.parse(this.data.echoEntInfo.entInfo.allow),
      certificateValue: JSON.parse(this.data.echoEntInfo.entInfo.standard),

      entTotalPeople: this.data.echoEntInfo.infoDetail.employeeNum,
      entJuniorCollegePeople: this.data.echoEntInfo.infoDetail.associateNum,
      entCollegePeople: this.data.echoEntInfo.infoDetail.bachelorNum,
      entMasterPeople: this.data.echoEntInfo.infoDetail.masterNum,
      entDoctorPeople: this.data.echoEntInfo.infoDetail.doctorNum,
      entSeniorProfessionalPeople: this.data.echoEntInfo.infoDetail.higherNum,
      entIntermediatePeople: this.data.echoEntInfo.infoDetail.secondaryNum,
      entScientificPeople: this.data.echoEntInfo.infoDetail.scientificNum,
      entDevelopPeople: this.data.echoEntInfo.infoDetail.developNum,

      intellectualPropertyTotalNum: this.data.echoEntInfo.infoDetail.propertyNum,
      intellectualPropertyOneNum: this.data.echoEntInfo.infoDetail.propertyFirstNum,
      intellectualPropertyTwoNum: this.data.echoEntInfo.infoDetail.propertySecondNum,
      patentNum: this.data.echoEntInfo.infoDetail.patentNum,
      trademarkNum: this.data.echoEntInfo.infoDetail.trademarkNum,
      copyrightsNum: this.data.echoEntInfo.infoDetail.softwareNum,
      PTCNum: this.data.echoEntInfo.infoDetail.pctNum,
    }, () => {
      this.handleBackTagCheck(JSON.parse(this.data.echoEntInfo.entInfo.certificate), '1');
      this.handleBackTagCheck(newOrgList, '2');
      this.handleBackTagCheck(JSON.parse(this.data.echoEntInfo.entInfo.allow), '3');
      this.handleBackTagCheck(JSON.parse(this.data.echoEntInfo.entInfo.standard), '4');
      wx.hideLoading();
    });
  },

  // 根据企业信用code码查询信息
  getEntInfo() {
    wx.showLoading({
      title: '加载中',
    });
    fetch.post('/enterprise/entInfo/queryEntAllInfo', { id: this.data.entId, flag: '2' }).then(res => {
      if(res.result == null) {
        this.setData({
          isEdit: false
        });
        return
      };
      this.setData({
        isEdit: true,
        echoEntInfo: res.result
      }, () => {
        this.toEcho();
      });
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
        industryMap: this.dealDictItemsMap(res.result.ent_info_sshy),
        industryOptions: res.result.ent_info_sshy.map(el => el.title),
        qualificationsHonorMap: this.dealDictItemsMap(res.result.ent_info_yqryrz),
        qualificationsHonorOptions: res.result.ent_info_yqryrz,
        organizationMap: this.dealDictItemsMap(res.result.ent_info_qyxsjg),
        organizationOptions: res.result.ent_info_qyxsjg,
        industryLicenseMap: this.dealDictItemsMap(res.result.ent_info_hyxk),
        industryLicenseOptions: res.result.ent_info_hyxk,
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

  getPersonData() {
    wx.showLoading({
      title: '加载中',
    });
    const params = {
      entId: this.data.entId,
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize
    };
    fetch.get('/enterprise/entUser/list', params).then(res => {
      this.setData({
        personList: this.data.pageNo > 1 ? this.data.personList.concat(res.result.records) : res.result.records,
        nomore: res.result.current >= res.result.pages ? true : false
      }, () => {
        wx.hideLoading();
      });
    });
  },

  toDeletePerson(e) {
    const id = e.currentTarget.dataset.id;
    let list = this.data.personList;
    list.splice(id, 1);
    this.setData({
      personList: list
    });
  },

  toRemoveAll() {
    wx.showModal({
      title: '解除激活提示',
      content: '确定要解除激活所有人员吗？',
      complete: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
          });
          fetch.get('/enterprise/entManger/remove/activationEnt', { entId: this.data.entId }).then(res => {
            if(res.code == 200) {
              wx.showToast({
                title: res.message
              });
              setTimeout(() => {
                this.setData({
                  personList: [],
                  pageNo: 1,
                  pageSize: 5
                }, ()=> {
                  this.getPersonData();
                  wx.hideLoading();
                });
              }, 1000);
            };
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    (async () => {
      await this.getAllDictItems();
      await setTimeout(() => {
        this.setData({
          entCode: options.entCode,
          entId: options.entId
        }, () => {
          this.getEntInfo();
          this.getPersonData();
        });
    
        this.setData({
          topTabIndex: 1,
          isMatch: options.isMatch ? JSON.parse(options.isMatch) : false,
          isMine: options.isMine ? JSON.parse(options.isMine) : false,
          entCode: options.entCode ? options.entCode : ''
        });
      }, 100);
    })();
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
    this.setData({
      nowYear: new Date().getFullYear(),
      pastThreeYears: new Date().getFullYear() - 3,
      pastTwoYears: new Date().getFullYear() - 2,
      lastYears: new Date().getFullYear() - 1
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
      personList: [],
      pageNo: 1,
      pageSize: 5
    }, ()=> {
      this.getPersonData();
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
      this.getPersonData();
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})