// pages/subpages/pages/completeEnterprise/completeEnterprise.js
const app = getApp();
import { fetch, fetchDiy } from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
    today: '',
    isMine: false,  //  true 是我的进入，false  精准推送进入
    isMatch: false, //  true 是智能匹配进入，false 是精准推送进入
    isComplete: false,
    completeTitle: false,
    showback: true, // 是否开启公共title返回按钮
    topTabIndex: 1,
    flag: 2,  //  1-PC、2-小程序添加企业、3-小程序完善企业
    isEdit: false,  //  是否编辑
    hasData: false,
    echoEntInfo: {},  //  回显信息大map
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
    entTTechnologyPeople: '',  //  技术人数
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
    pastThreeProfit: '',  //  近三年利润率
    //  近两年
    hasPastTwoYearData: false,
    pastTwoOperatingRevenue: '',  //  近两年营业收入
    pastTwoMainOperatingRevenue: '',  //  近两年主营业务收入
    pastTwoListed: '', //  上市情况
    pastTwoEntFinancingMoney: '',  //  近两年企业融资金额
    pastTwoRAndDMoney: '',  //  近两年研发投入
    pastTwoProfit: '',  //  近两年利润率
    //  去年
    hasLastYearData: false,
    lastOperatingRevenue: '',  //  去年营业收入
    lastMainOperatingRevenue: '',  //  去年主营业务收入
    lastListed: '', //  上市情况
    lastEntFinancingMoney: '',  //  去年企业融资金额
    lastRAndDMoney: '',  //  去年研发投入
    lastProfit: '',  //  去年利润率
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
    showMoreEl4: false, //  创新创业示范基地--额外内容
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
    //  创新创业示范基地
    newArea: '',  //  场地面积
    newHatch: '',  //  在孵企业
    newHatchProfit: '',  //  孵化成功率（%）

    // 字典映射
    entSizeMap: {}, //  企业规模
    entTypeMap: {}, //  企业类型
    industryMap: {},  //  所属行业
    qualificationsHonorMap: {}, //  资质荣誉
    organizationMap: {}, //  机构设置
    industryLicenseMap: {}, //  行业许可
    certificateMap: {}, //  质量认证

    modalVisible: false,  //  已激活、注销弹窗
    modalType: 0, //  1-已激活，2-注销
    bindphone: '',

    // 错误提示
    showTextVisible: false,
    showTextContent: '' //  提示内容
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
    if(e.detail.value.length != 18) {
      wx.showToast({
        title: '企业信用代码必须为18位',
        icon: 'none'
      });
      this.setData({
        entCode: ''
      });
      return
    };
    this.setData({
      entCode: e.detail.value
    }, () => {
      this.getEntInfo();
    });
  },
 
  //  企业名称
  entNameInput(e) {
    if(e.detail.value.length > 40) {
      wx.showToast({
        title: '企业名称不应超过40位！',
        icon: 'none'
      });
      this.setData({
        entName: ''
      });
      return
    };
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
    if(e.detail.value.length > 5) {
      wx.showToast({
        title: '企业总人数不应超过5位数！',
        icon: 'none'
      });
      this.setData({
        entTotalPeople: ''
      });
      return
    };
    this.setData({
      entTotalPeople: e.detail.value
    });
  },
 
  //  大专以上
  entJuniorCollegePeopleInput(e) {
    if(e.detail.value.length > 5) {
      wx.showToast({
        title: '大专以上人数不应超过5位数！',
        icon: 'none'
      });
      this.setData({
        entJuniorCollegePeople: ''
      });
      return
    };
    this.setData({
      entJuniorCollegePeople: e.detail.value
    });
  },
 
  //  本科以上
  entCollegePeopleInput(e) {
    if(e.detail.value.length > 5) {
      wx.showToast({
        title: '本科以上人数不应超过5位数！',
        icon: 'none'
      });
      this.setData({
        entCollegePeople: ''
      });
      return
    };
    this.setData({
      entCollegePeople: e.detail.value
    });
  },
 
  //  硕士以上
  entMasterPeopleInput(e) {
    if(e.detail.value.length > 5) {
      wx.showToast({
        title: '硕士以上人数不应超过5位数！',
        icon: 'none'
      });
      this.setData({
        entMasterPeople: ''
      });
      return
    };
    this.setData({
      entMasterPeople: e.detail.value
    });
  },
 
  //  博士
  entDoctorPeopleInput(e) {
    if(e.detail.value.length > 5) {
      wx.showToast({
        title: '博士人数不应超过5位数！',
        icon: 'none'
      });
      this.setData({
        entDoctorPeople: ''
      });
      return
    };
    this.setData({
      entDoctorPeople: e.detail.value
    });
  },
 
  //  高级职称
  entSeniorProfessionalPeopleInput(e) {
    if(e.detail.value.length > 5) {
      wx.showToast({
        title: '高级职称人数不应超过5位数！',
        icon: 'none'
      });
      this.setData({
        entSeniorProfessionalPeople: ''
      });
      return
    };
    this.setData({
      entSeniorProfessionalPeople: e.detail.value
    });
  },
 
  //  中级职称
  entIntermediatePeopleInput(e) {
    if(e.detail.value.length > 5) {
      wx.showToast({
        title: '中级职称人数不应超过5位数！',
        icon: 'none'
      });
      this.setData({
        entIntermediatePeople: ''
      });
      return
    };
    this.setData({
      entIntermediatePeople: e.detail.value
    });
  },
 
  //  科研人员
  entScientificPeopleInput(e) {
    if(e.detail.value.length > 5) {
      wx.showToast({
        title: '科研人员人数不应超过5位数！',
        icon: 'none'
      });
      this.setData({
        entScientificPeople: ''
      });
      return
    };
    this.setData({
      entScientificPeople: e.detail.value
    });
  },

  //  研发人员
  entDevelopPeopleInput(e) {
    if(e.detail.value.length > 5) {
      wx.showToast({
        title: '研发人员人数不应超过5位数！',
        icon: 'none'
      });
      this.setData({
        entDevelopPeople: ''
      });
      return
    };
    this.setData({
      entDevelopPeople: e.detail.value
    });
  },
 
  //  技术人员
  entTTechnologyPeopleInput(e) {
    if(e.detail.value.length > 5) {
      wx.showToast({
        title: '技术人员人数不应超过5位数！',
        icon: 'none'
      });
      this.setData({
        entTTechnologyPeople: ''
      });
      return
    };
    this.setData({
      entTTechnologyPeople: e.detail.value
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
    if(e.detail.value > 1000000000000) {
      wx.showToast({
        title: '营业收入不应超过12位数！',
        icon: 'none'
      });
      this.setData({
        pastThreeOperatingRevenue: ''
      });
      return
    };
    this.setData({
      pastThreeOperatingRevenue: e.detail.value,
      hasPastThreeYearData: true
    })
  },

  //  主营业务收入
  pastThreeMainOperatingRevenueInput(e) {
    if(e.detail.value > 1000000000000) {
      wx.showToast({
        title: '主营业务收入不应超过12位数！',
        icon: 'none'
      });
      this.setData({
        pastThreeMainOperatingRevenue: ''
      });
      return
    };
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
    if(e.detail.value > 1000000000000) {
      wx.showToast({
        title: '企业融资金额不应超过12位数！',
        icon: 'none'
      });
      this.setData({
        pastThreeEntFinancingMoney: ''
      });
      return
    };
    this.setData({
      pastThreeEntFinancingMoney: e.detail.value
    })
  },

  //  研发投入
  pastThreeRAndDMoneyInput(e) {
    if(e.detail.value > 1000000000000) {
      wx.showToast({
        title: '研发投入不应超过12位数！',
        icon: 'none'
      });
      this.setData({
        pastThreeRAndDMoney: ''
      });
      return
    };
    this.setData({
      pastThreeRAndDMoney: e.detail.value
    })
  },

  //  利润率
  pastThreeProfitInput(e) {
    if(e.detail.value > 100000) {
      wx.showToast({
        title: '利润率不应超过5位数！',
        icon: 'none'
      });
      this.setData({
        pastThreeProfit: ''
      });
      return
    };
    this.setData({
      pastThreeProfit: e.detail.value
    })
  },

  //  近两年
  //  营业收入
  pastTwoOperatingRevenueInput(e) {
    if(e.detail.value > 1000000000000) {
      wx.showToast({
        title: '营业收入不应超过12位数！',
        icon: 'none'
      });
      this.setData({
        pastTwoOperatingRevenue: ''
      });
      return
    };
    this.setData({
      pastTwoOperatingRevenue: e.detail.value,
      hasPastTwoYearData: true
    })
  },

  //  主营业务收入
  pastTwoMainOperatingRevenueInput(e) {
    if(e.detail.value > 1000000000000) {
      wx.showToast({
        title: '主营业务收入不应超过12位数！',
        icon: 'none'
      });
      this.setData({
        pastTwoMainOperatingRevenue: ''
      });
      return
    };
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
    if(e.detail.value > 1000000000000) {
      wx.showToast({
        title: '企业融资金额不应超过12位数！',
        icon: 'none'
      });
      this.setData({
        pastTwoEntFinancingMoney: ''
      });
      return
    };
    this.setData({
      pastTwoEntFinancingMoney: e.detail.value
    })
  },

  //  研发投入
  pastTwoRAndDMoneyInput(e) {
    if(e.detail.value > 1000000000000) {
      wx.showToast({
        title: '研发投入不应超过12位数！',
        icon: 'none'
      });
      this.setData({
        pastTwoRAndDMoney: ''
      });
      return
    };
    this.setData({
      pastTwoRAndDMoney: e.detail.value
    })
  },

  //  利润率
  pastTwoProfitInput(e) {
    if(e.detail.value > 100000) {
      wx.showToast({
        title: '利润率不应超过5位数！',
        icon: 'none'
      });
      this.setData({
        pastTwoProfit: ''
      });
      return
    };
    this.setData({
      pastTwoProfit: e.detail.value
    })
  },

  //  去年
  //  营业收入
  lastOperatingRevenueInput(e) {
    if(e.detail.value > 1000000000000) {
      wx.showToast({
        title: '营业收入不应超过12位数！',
        icon: 'none'
      });
      this.setData({
        lastOperatingRevenue: ''
      });
      return
    };
    this.setData({
      lastOperatingRevenue: e.detail.value,
      hasLastYearData: true
    })
  },

  //  主营业务收入
  lastMainOperatingRevenueInput(e) {
    if(e.detail.value > 1000000000000) {
      wx.showToast({
        title: '主营业务收入不应超过12位数！',
        icon: 'none'
      });
      this.setData({
        lastMainOperatingRevenue: ''
      });
      return
    };
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
    if(e.detail.value > 1000000000000) {
      wx.showToast({
        title: '企业融资金额不应超过12位数！',
        icon: 'none'
      });
      this.setData({
        lastEntFinancingMoney: ''
      });
      return
    };
    this.setData({
      lastEntFinancingMoney: e.detail.value
    })
  },

  //  研发投入
  lastRAndDMoneyInput(e) {
    if(e.detail.value > 1000000000000) {
      wx.showToast({
        title: '研发投入不应超过12位数！',
        icon: 'none'
      });
      this.setData({
        lastRAndDMoney: ''
      });
      return
    };
    this.setData({
      lastRAndDMoney: e.detail.value
    })
  },

  //  利润率
  lastProfitInput(e) {
    if(e.detail.value > 100000) {
      wx.showToast({
        title: '利润率不应超过5位数！',
        icon: 'none'
      });
      this.setData({
        lastProfit: ''
      });
      return
    };
    this.setData({
      lastProfit: e.detail.value
    })
  },

  //  企业知识产权
  //  知识产权总数
  intellectualPropertyTotalNumInput(e) {
    if(e.detail.value.length > 3) {
      wx.showToast({
        title: '知识产权总数不应超过3位数！',
        icon: 'none'
      });
      this.setData({
        intellectualPropertyTotalNum: ''
      });
      return
    };
    this.setData({
      intellectualPropertyTotalNum: e.detail.value
    })
  },

  //  一类知识产权数
  intellectualPropertyOneNumInput(e) {
    if(e.detail.value.length > 3) {
      wx.showToast({
        title: '一类知识产权数不应超过3位数！',
        icon: 'none'
      });
      this.setData({
        intellectualPropertyOneNum: ''
      });
      return
    };
    this.setData({
      intellectualPropertyOneNum: e.detail.value
    })
  },

  //  二类知识产权数
  intellectualPropertyTwoNumInput(e) {
    if(e.detail.value.length > 3) {
      wx.showToast({
        title: '二类知识产权数不应超过3位数！',
        icon: 'none'
      });
      this.setData({
        intellectualPropertyTwoNum: ''
      });
      return
    };
    this.setData({
      intellectualPropertyTwoNum: e.detail.value
    })
  },

  //  专利总数
  patentNumInput(e) {
    if(e.detail.value.length > 3) {
      wx.showToast({
        title: '专利总数不应超过3位数！',
        icon: 'none'
      });
      this.setData({
        patentNum: ''
      });
      return
    };
    this.setData({
      patentNum: e.detail.value
    })
  },

  //  注册商标总数
  trademarkNumInput(e) {
    if(e.detail.value.length > 3) {
      wx.showToast({
        title: '注册商标总数不应超过3位数！',
        icon: 'none'
      });
      this.setData({
        trademarkNum: ''
      });
      return
    };
    this.setData({
      trademarkNum: e.detail.value
    })
  },

  //  软件著作权总数
  copyrightsNumInput(e) {
    if(e.detail.value.length > 3) {
      wx.showToast({
        title: '软件著作权总数不应超过3位数！',
        icon: 'none'
      });
      this.setData({
        copyrightsNum: ''
      });
      return
    };
    this.setData({
      copyrightsNum: e.detail.value
    })
  },

  //  国际专利（PTC）数
  PTCNumInput(e) {
    if(e.detail.value.length > 3) {
      wx.showToast({
        title: '国际专利（PTC）数不应超过3位数！',
        icon: 'none'
      });
      this.setData({
        PTCNum: ''
      });
      return
    };
    this.setData({
      PTCNum: e.detail.value
    })
  },

  //  其他信息
  // 科技企业孵化器
  //  场地面积
  scienceSiteAreaInput(e) {
    if(e.detail.value.length > 12) {
      wx.showToast({
        title: '场地面积不应超过12位数！',
        icon: 'none'
      });
      this.setData({
        scienceSiteArea: ''
      });
      return
    };
    this.setData({
      scienceSiteArea: e.detail.value
    });
  },

  //  资金规模
  scienceMoneyInput(e) {
    if(e.detail.value.length > 12) {
      wx.showToast({
        title: '资金规模不应超过12位数！',
        icon: 'none'
      });
      this.setData({
        scienceMoney: ''
      });
      return
    };
    this.setData({
      scienceMoney: e.detail.value
    });
  },

  //  在孵企业
  scienceHatchInput(e) {
    if(e.detail.value.length > 12) {
      wx.showToast({
        title: '在孵企业不应超过12位数！',
        icon: 'none'
      });
      this.setData({
        scienceHatch: ''
      });
      return
    };
    this.setData({
      scienceHatch: e.detail.value
    });
  },

  //  累计毕业企业
  scienceGraduateInput(e) {
    if(e.detail.value.length > 12) {
      wx.showToast({
        title: '累计毕业企业不应超过12位数！',
        icon: 'none'
      });
      this.setData({
        scienceGraduate: ''
      });
      return
    };
    this.setData({
      scienceGraduate: e.detail.value
    });
  },

  // 众创空间
  //  场地面积
  spaceSiteAreaInput(e) {
    if(e.detail.value.length > 12) {
      wx.showToast({
        title: '场地面积不应超过12位数！',
        icon: 'none'
      });
      this.setData({
        spaceSiteArea: ''
      });
      return
    };
    this.setData({
      spaceSiteArea: e.detail.value
    });
  },

  //  资金规模
  spaceMoneyInput(e) {
    if(e.detail.value.length > 12) {
      wx.showToast({
        title: '资金规模不应超过12位数！',
        icon: 'none'
      });
      this.setData({
        spaceMoney: ''
      });
      return
    };
    this.setData({
      spaceMoney: e.detail.value
    });
  },

  //  专业服务人员
  spaceWaiterInput(e) {
    if(e.detail.value.length > 12) {
      wx.showToast({
        title: '专业服务人员不应超过12位数！',
        icon: 'none'
      });
      this.setData({
        spaceWaiter: ''
      });
      return
    };
    this.setData({
      spaceWaiter: e.detail.value
    });
  },

  // 公共服务示范平台
  //  场地面积
  publicSiteAreaInput(e) {
    if(e.detail.value.length > 12) {
      wx.showToast({
        title: '场地面积不应超过12位数！',
        icon: 'none'
      });
      this.setData({
        publicSiteArea: ''
      });
      return
    };
    this.setData({
      publicSiteArea: e.detail.value
    });
  },

  //  资金规模
  publicMoneyInput(e) {
    if(e.detail.value.length > 12) {
      wx.showToast({
        title: '资金规模不应超过12位数！',
        icon: 'none'
      });
      this.setData({
        publicMoney: ''
      });
      return
    };
    this.setData({
      publicMoney: e.detail.value
    });
  },

  //  在孵企业
  publicHatchInput(e) {
    if(e.detail.value.length > 12) {
      wx.showToast({
        title: '在孵企业不应超过12位数！',
        icon: 'none'
      });
      this.setData({
        publicHatch: ''
      });
      return
    };
    this.setData({
      publicHatch: e.detail.value
    });
  },

  //  累计毕业企业
  publicGraduateInput(e) {
    if(e.detail.value.length > 12) {
      wx.showToast({
        title: '累计毕业企业不应超过12位数！',
        icon: 'none'
      });
      this.setData({
        publicGraduate: ''
      });
      return
    };
    this.setData({
      publicGraduate: e.detail.value
    });
  },

  // 创新创业示范基地
  //  场地面积
  newAreaInput(e) {
    if(e.detail.value.length > 12) {
      wx.showToast({
        title: '场地面积不应超过12位数！',
        icon: 'none'
      });
      this.setData({
        newArea: ''
      });
      return
    };
    this.setData({
      newArea: e.detail.value
    });
  },

  //  在孵企业
  newHatchInput(e) {
    if(e.detail.value.length > 12) {
      wx.showToast({
        title: '在孵企业不应超过12位数！',
        icon: 'none'
      });
      this.setData({
        newHatch: ''
      });
      return
    };
    this.setData({
      newHatch: e.detail.value
    });
  },

  //  孵化成功率
  newHatchProfitInput(e) {
    if(e.detail.value > 100) {
      wx.showToast({
        title: '孵化成功率不应超过100%！',
        icon: 'none'
      });
      this.setData({
        newHatchProfit: ''
      });
      return
    };
    this.setData({
      newHatchProfit: e.detail.value
    });
  },

  // 弹出层
  onVisibleChange(e) {
    this.setData({
      visible: e.detail.visible
    });
  },

  onModalVisibleChange(e) {
    this.setData({
      modalVisible: e.detail.visible
    });
  },

  handleClose() {
    this.setData({
      entCode: '',
      modalVisible: false
    });
  },

  toUnbindEnt() {
    const entCodes = this.data.entCode;
    this.setData({
      modalType: 0,
      modalVisible: false,
      entCode: ''
    }, () => {
      wx.navigateTo({
        url: '/pages/subpages/pages/unbindEnt/unbindEnt?entCode=' + entCodes
      });
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
        // 先清空所有选中
        list.forEach(el => el.checked = false);
        arr.map(el => {
          list.forEach(item => {
            if(item.value == el) item.checked = true;
          });
        });
        this.setData({ qualificationsHonorOptions: list })
        break;
      case '2':
        list = this.data.organizationOptions;
        list.forEach(el => el.checked = false);
        arr.map(el => {
          list.forEach(item => {
            if(item.value == el) item.checked = true;
          });
        });
        let { showMoreEl1, showMoreEl2, showMoreEl3, showMoreEl4 } = this.data;
        // 特别判断
        showMoreEl1 = arr.findIndex(el => el == 'a') != -1 ? true : false;
        showMoreEl2 = arr.findIndex(el => el == 'b') != -1 ? true : false;
        showMoreEl3 = arr.findIndex(el => el == 'c') != -1 ? true : false;
        showMoreEl4 = arr.findIndex(el => el == 'f') != -1 ? true : false;
        this.setData({ 
          organizationOptions: list,
          showMoreEl1: showMoreEl1,
          showMoreEl2: showMoreEl2,
          showMoreEl3: showMoreEl3,
          showMoreEl4: showMoreEl4
        })
        break;
      case '3':
        list = this.data.industryLicenseOptions;
        list.forEach(el => el.checked = false);
        arr.map(el => {
          list.forEach(item => {
            if(item.value == el) item.checked = true;
          });
        });
        this.setData({ industryLicenseOptions: list })
        break;
      case '4':
        list = this.data.certificateOptions;
        list.forEach(el => el.checked = false);
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
        let { showMoreEl1, showMoreEl2, showMoreEl3, showMoreEl4 } = this.data;
        // 特别判断
        showMoreEl1 = list.findIndex(el => el == 'a') != -1 ? true : false;
        showMoreEl2 = list.findIndex(el => el == 'b') != -1 ? true : false;
        showMoreEl3 = list.findIndex(el => el == 'c') != -1 ? true : false;
        showMoreEl4 = list.findIndex(el => el == 'f') != -1 ? true : false;
        this.setData({
          organizationValue: list,
          showMoreEl1: showMoreEl1,
          showMoreEl2: showMoreEl2,
          showMoreEl3: showMoreEl3,
          showMoreEl4: showMoreEl4
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
    if(this.data.entCode == '') {
      wx.showToast({
        title: '企业统一信用代码不能为空！',
        icon: 'none',
        duration: 3000
      });
      return
    };
    if(this.data.entName == '') {
      wx.showToast({
        title: '企业名称不能为空！',
        icon: 'none',
        duration: 3000
      });
      return
    };
    if(!this.checkPeopleAndKnowledge()) return;
    wx.showLoading({
      title: '加载中',
    });
    this.setData({ showback: false });
    const that = this;
    let moreInfo = this.data.organizationValue ? [] : null;
    if(this.data.organizationValue) {
      this.data.organizationValue.map(el => {
        let obj = {};
        if(el == 'a') {
          obj = {
            value: el,
            area: this.data.scienceSiteArea,
            finance: this.data.scienceMoney,
            entNum: this.data.scienceHatch,
            graduateEntNum: this.data.scienceGraduate
          };
        } else if(el == 'b') {
          obj = {
            value: el,
            area: this.data.spaceSiteArea,
            finance: this.data.spaceMoney,
            servicerNum: this.data.spaceWaiter
          };
        } else if(el == 'c') {
          obj = {
            value: el,
            area: this.data.publicSiteArea,
            finance: this.data.publicMoney,
            entNum: this.data.publicHatch,
            graduateEntNum: this.data.publicGraduate
          };
        } else if(el == 'f') {
          obj = {
            value: el,
            area: this.data.newArea,
            entNum: this.data.newHatch,
            incubateRate: this.data.newHatchProfit
          };
        } else {
          obj = { value: el };
        };
        moreInfo.push(obj);
      });
    };
    let yearsList = [];
    if(this.data.hasPastThreeYearData) {
      yearsList.push({
        year: this.data.pastThreeYears,
        businessIncome: this.data.pastThreeOperatingRevenue,
        mainBusinessIncome: this.data.pastThreeOperatingRevenue,
        ssqk: this.data.pastThreeListed == -1 ? null : Number(this.data.pastThreeListed) + 1,
        financing: this.data.pastThreeEntFinancingMoney,
        developInvest: this.data.pastThreeRAndDMoney,
        profitRate: this.data.pastThreeProfit
      });
    };
    if(this.data.hasPastTwoYearData) {
      yearsList.push({
        year: this.data.pastTwoYears,
        businessIncome: this.data.pastTwoOperatingRevenue,
        mainBusinessIncome: this.data.pastTwoMainOperatingRevenue,
        ssqk: this.data.pastTwoListed == -1 ? null : Number(this.data.pastTwoListed) + 1,
        financing: this.data.pastTwoEntFinancingMoney,
        developInvest: this.data.pastTwoRAndDMoney,
        profitRate: this.data.pastTwoProfit
      });
    };
    if(this.data.hasLastYearData) {
      yearsList.push({
        year: this.data.lastYears,
        businessIncome: this.data.lastOperatingRevenue,
        mainBusinessIncome: this.data.lastMainOperatingRevenue,
        ssqk: this.data.lastListed == -1 ? null : Number(this.data.lastListed) + 1,
        financing: this.data.lastEntFinancingMoney,
        developInvest: this.data.lastRAndDMoney,
        profitRate: this.data.lastProfit
      });
    };
    const params = {
      flag: this.data.flag, //  1-PC、2-小程序端
      entInfo: {
        entName: this.data.entName,
        creditCode: this.data.entCode,
        estDate: this.data.registerDate,
        reg: this.data.regionCode,
        entScale: this.data.entSizeMap[this.data.entSizeOption[this.data.entSize]],
        entType: this.data.entTypeMap[this.data.entTypeOptions[this.data.entType]],
        trade: this.data.industryMap[this.data.industryOptions[this.data.industry]],
        entLocation: this.data.longitude + ',' + this.data.latitude,
        address: this.data.entAdress,
        certificate: this.data.qualificationsHonorValue ? JSON.stringify(this.data.qualificationsHonorValue) : null,
        orgSetting: moreInfo ? JSON.stringify(moreInfo) : null,
        allow: this.data.industryLicenseValue ? JSON.stringify(this.data.industryLicenseValue) : null,
        standard: this.data.certificateValue ? JSON.stringify(this.data.certificateValue) : null
      },
      infoDetail: {
        employeeNum: this.data.entTotalPeople,
        associateNum: this.data.entJuniorCollegePeople,
        bachelorNum: this.data.entCollegePeople,
        masterNum: this.data.entMasterPeople,
        doctorNum: this.data.entDoctorPeople,
        higherNum: this.data.entSeniorProfessionalPeople,
        secondaryNum: this.data.entIntermediatePeople,
        scientificNum: this.data.entScientificPeople,
        developNum: this.data.entDevelopPeople,
        technicianNum: this.data.entTTechnologyPeople,
        propertyNum: this.data.intellectualPropertyTotalNum,
        propertyFirstNum: this.data.intellectualPropertyOneNum,
        propertySecondNum: this.data.intellectualPropertyTwoNum,
        patentNum: this.data.patentNum,
        trademarkNum: this.data.trademarkNum,
        softwareNum: this.data.copyrightsNum,
        pctNum: this.data.PTCNum
      },
      infoManages: yearsList
    };
    if(!this.data.isEdit) {
      // 添加企业
      fetchDiy.post('/enterprise/entInfo/add', params).then(res => {
        if(res.code == 500) {
          that.setData({
            showback: true,
            showTextVisible: true,
            showTextContent: res.message
          });
          return
        };
        if(res.code == 200) {
          wx.showToast({
            title: res.message,
            icon: 'success',
            duration: 1000
          });
          setTimeout(() => {
            wx.hideLoading();
            that.setData({ showback: false });
            if(that.data.isMine) {
              this.getEnterpriseInfo();
              if(that.data.isComplete) wx.navigateBack();
            } else {
              app.globalData.isMatch = that.data.isMatch ? that.data.isMatch : false;
              wx.navigateBack();
            };
          }, 1000);
        };
      });
    } else {
      params.entInfo.id = this.data.echoEntInfo.entInfo.id;
      // 编辑企业
      fetchDiy.post('/enterprise/entInfo/edit', params).then(res => {
        if(res.code == 500) {
          that.setData({
            showback: true,
            showTextVisible: true,
            showTextContent: res.message
          });
          return
        };
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 1000
        });
        setTimeout(() => {
          wx.hideLoading();
          that.setData({ showback: false });
          if(that.data.isMine) {
            this.getEnterpriseInfo();
            if(that.data.isComplete) wx.navigateBack();
          } else {
            app.globalData.isMatch = that.data.isMatch ? that.data.isMatch : false;
            wx.navigateBack();
          };
        }, 1000);
      });
    };
  },

  // 校验企业人数和知识产权
  checkPeopleAndKnowledge() {
    let allEducationPeopleNum = 0;
    allEducationPeopleNum = Number(this.data.entJuniorCollegePeople || 0) + Number(this.data.entCollegePeople || 0) + Number(this.data.entMasterPeople || 0) + Number(this.data.entDoctorPeople || 0);
    // 学历人数总和与企业人数对比
    if(Number(this.data.entTotalPeople || 0) < allEducationPeopleNum) {
      this.setData({
        showTextVisible: true,
        showTextContent: '您当前输入的人数总和大于企业总人数！'
      });
      return false;
    };
    if(Number(this.data.entTotalPeople || 0) < Number(this.data.entSeniorProfessionalPeople || 0)) {
      this.setData({
        showTextVisible: true,
        showTextContent: '您当前输入的高级职称人数大于企业总人数！'
      });
      return false;
    };
    if(Number(this.data.entTotalPeople || 0) < Number(this.data.entIntermediatePeople || 0)) {
      this.setData({
        showTextVisible: true,
        showTextContent: '您当前输入的中级职称人数大于企业总人数！'
      });
      return false;
    };
    if(Number(this.data.entTotalPeople || 0) < Number(this.data.entDevelopPeople || 0)) {
      this.setData({
        showTextVisible: true,
        showTextContent: '您当前输入的研发人数大于企业总人数！'
      });
      return false;
    };
    if(Number(this.data.entTotalPeople || 0) < Number(this.data.entScientificPeople || 0)) {
      this.setData({
        showTextVisible: true,
        showTextContent: '您当前输入的科研人数大于企业总人数！'
      });
      return false;
    };
    if(Number(this.data.entTotalPeople || 0) < Number(this.data.entTTechnologyPeople || 0)) {
      this.setData({
        showTextVisible: true,
        showTextContent: '您当前输入的技术人数大于企业总人数！'
      });
      return false;
    };

    // 学历人数总和与企业人数对比
    let allIntellectualPropertyNum = 0;
    allIntellectualPropertyNum = Number(this.data.intellectualPropertyOneNum || 0) + Number(this.data.intellectualPropertyTwoNum || 0) + Number(this.data.patentNum || 0) + Number(this.data.trademarkNum || 0) + Number(this.data.copyrightsNum || 0) + Number(this.data.PTCNum || 0);
    if(Number(this.data.intellectualPropertyTotalNum || 0) < allIntellectualPropertyNum) {
      this.setData({
        showTextVisible: true,
        showTextContent: '您当前输入的数量总和超出知识产权总数！'
      });
      return false;
    };
    return true;
  },

  closeDialog() {
    this.setData({ showTextVisible: false });
  },

  // 处理数据
  findKey(obj, value, compare = (a, b) => a === b) {
    return Object.keys(obj).find(k => compare(obj[k], value));
  },

  // 数据回显
  toEcho() {
    let newOrgList = [];
    let orgList = this.data.echoEntInfo.entInfo ? this.data.echoEntInfo.entInfo.orgSetting ? JSON.parse(this.data.echoEntInfo.entInfo.orgSetting) : null : null;
    if(orgList) {
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
        if(el.value == 'f') {
          this.setData({
            newArea: el.area,
            newHatch: el.entNum,
            newHatchProfit: el.incubateRate
          });
        };
      });
    };

    let manageInfo = this.data.echoEntInfo.infoManages || [];
    manageInfo.forEach(el => {
      if(el.year == this.data.pastThreeYears) {
        this.setData({
          hasPastThreeYearData: true,
          pastThreeOperatingRevenue: el.businessIncome,
          pastThreeMainOperatingRevenue: el.mainBusinessIncome,
          pastThreeListed: Number(el.ssqk) - 1,
          pastThreeEntFinancingMoney: el.financing,
          pastThreeRAndDMoney: el.developInvest,
          pastThreeProfit: el.profitRate
        });
      };
      if(el.year == this.data.pastTwoYears) {
        this.setData({
          hasPastTwoYearData: true,
          pastTwoOperatingRevenue: el.businessIncome,
          pastTwoMainOperatingRevenue: el.mainBusinessIncome,
          pastTwoListed: Number(el.ssqk) - 1,
          pastTwoEntFinancingMoney: el.financing,
          pastTwoRAndDMoney: el.developInvest,
          pastTwoProfit: el.profitRate
        });
      };
      if(el.year == this.data.lastYears) {
        this.setData({
          hasLastYearData: true,
          lastOperatingRevenue: el.businessIncome,
          lastMainOperatingRevenue: el.mainBusinessIncome,
          lastListed: Number(el.ssqk) - 1,
          lastEntFinancingMoney: el.financing,
          lastRAndDMoney: el.developInvest,
          lastProfit: el.profitRate
        });
      };
    });
    let regionList = this.data.echoEntInfo.regName ? this.data.echoEntInfo.regName.split('/') : [];
    if(regionList != []) regionList[1] = regionList[1] == '市辖区' ? regionList[0] : regionList[1];

    let hasLocation = false, oldLongitude = '', oldLatitude = '';
    if(this.data.echoEntInfo.entInfo && this.data.echoEntInfo.entInfo.entLocation) {
      hasLocation = true;
      oldLongitude = this.data.echoEntInfo.entInfo.entLocation.split(',')[0];
      oldLatitude = this.data.echoEntInfo.entInfo.entLocation.split(',')[1];
    };
    let entSize = '', entType = '', industry = '';
    if(this.data.echoEntInfo.entInfo != null) {
      entSize = this.findKey(this.data.entSizeOption, this.findKey(this.data.entSizeMap, this.data.echoEntInfo.entInfo.entScale));
      entType = Number(this.data.echoEntInfo.entInfo.entType)-1;
      industry = this.findKey(this.data.industryOptions, this.findKey(this.data.industryMap, this.data.echoEntInfo.entInfo.trade));
    };
    this.setData({
      entCode: this.data.echoEntInfo.entInfo != null ? this.data.echoEntInfo.entInfo.creditCode : '',
      entName: this.data.echoEntInfo.entInfo != null ? this.data.echoEntInfo.entInfo.entName : '',
      entAdress: this.data.echoEntInfo.entInfo != null ? this.data.echoEntInfo.entInfo.address : '',
      registerDate: this.data.echoEntInfo.entInfo != null ? this.data.echoEntInfo.entInfo.estDate : '',
      regionCode: this.data.echoEntInfo.entInfo != null ? this.data.echoEntInfo.entInfo.reg : '',
      region: regionList,
      entSize: entSize,
      entType: entType,
      industry: industry,
      switchGisChecked: hasLocation,
      longitude: oldLongitude,
      latitude: oldLatitude,
      qualificationsHonorValue: this.data.echoEntInfo.entInfo != null ? JSON.parse(this.data.echoEntInfo.entInfo.certificate) : '',
      organizationValue: newOrgList.length > 0 ? newOrgList : null,
      industryLicenseValue: this.data.echoEntInfo.entInfo != null ? JSON.parse(this.data.echoEntInfo.entInfo.allow) : '',
      certificateValue: this.data.echoEntInfo.entInfo != null ? JSON.parse(this.data.echoEntInfo.entInfo.standard) : '',

      entTotalPeople: this.data.echoEntInfo.infoDetail != null ? this.data.echoEntInfo.infoDetail.employeeNum : '',
      entJuniorCollegePeople: this.data.echoEntInfo.infoDetail != null ? this.data.echoEntInfo.infoDetail.associateNum : '',
      entCollegePeople: this.data.echoEntInfo.infoDetail != null ? this.data.echoEntInfo.infoDetail.bachelorNum : '',
      entMasterPeople: this.data.echoEntInfo.infoDetail != null ? this.data.echoEntInfo.infoDetail.masterNum : '',
      entDoctorPeople: this.data.echoEntInfo.infoDetail != null ? this.data.echoEntInfo.infoDetail.doctorNum : '',
      entSeniorProfessionalPeople: this.data.echoEntInfo.infoDetail != null ? this.data.echoEntInfo.infoDetail.higherNum : '',
      entIntermediatePeople: this.data.echoEntInfo.infoDetail != null ? this.data.echoEntInfo.infoDetail.secondaryNum : '',
      entScientificPeople: this.data.echoEntInfo.infoDetail != null ? this.data.echoEntInfo.infoDetail.scientificNum : '',
      entDevelopPeople: this.data.echoEntInfo.infoDetail != null ? this.data.echoEntInfo.infoDetail.developNum : '',
      entTTechnologyPeople: this.data.echoEntInfo.infoDetail != null ? this.data.echoEntInfo.infoDetail.technicianNum : '',

      intellectualPropertyTotalNum: this.data.echoEntInfo.infoDetail != null ? this.data.echoEntInfo.infoDetail.propertyNum : '',
      intellectualPropertyOneNum: this.data.echoEntInfo.infoDetail != null ? this.data.echoEntInfo.infoDetail.propertyFirstNum : '',
      intellectualPropertyTwoNum: this.data.echoEntInfo.infoDetail != null ? this.data.echoEntInfo.infoDetail.propertySecondNum : '',
      patentNum: this.data.echoEntInfo.infoDetail != null ? this.data.echoEntInfo.infoDetail.patentNum : '',
      trademarkNum: this.data.echoEntInfo.infoDetail != null ? this.data.echoEntInfo.infoDetail.trademarkNum : '',
      copyrightsNum: this.data.echoEntInfo.infoDetail != null ? this.data.echoEntInfo.infoDetail.softwareNum : '',
      PTCNum: this.data.echoEntInfo.infoDetail != null ? this.data.echoEntInfo.infoDetail.pctNum : '',
    }, () => {
      this.handleBackTagCheck(this.data.echoEntInfo.entInfo.certificate != null ? JSON.parse(this.data.echoEntInfo.entInfo.certificate) : [], '1');
      this.handleBackTagCheck(newOrgList, '2');
      this.handleBackTagCheck(this.data.echoEntInfo.entInfo.allow != null ? JSON.parse(this.data.echoEntInfo.entInfo.allow) : [], '3');
      this.handleBackTagCheck(this.data.echoEntInfo.entInfo.standard != null ? JSON.parse(this.data.echoEntInfo.entInfo.standard) : [], '4');
      wx.hideLoading();
    });
  },
  
  // 获取企业信息
  getEnterpriseInfo() {
    fetch.get('/enterprise/entUser/queryEntInfo').then(res => {
      this.setData({
        entInfo: res.result
      }, () => {
        wx.setStorageSync('entInfo', res.result);
        wx.switchTab({
          url: '/pages/home/home',
        });
      });
    });
  },

  // 根据企业信用code码查询信息
  getEntInfo() {
    wx.showLoading({
      title: '加载中',
    });
    fetch.post('/enterprise/entInfo/queryEntAllInfo', { creditCode: this.data.entCode, flag: this.data.flag }).then(res => {
      if(res.code == 500) {
        this.setData({
          entCode: ''
        });
        wx.hideLoading();
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 3000
        });
        return
      };
      if(res.result == null) {
        this.setData({
          hasData: false,
          isEdit: false
        }, () => {
          wx.hideLoading();
        });
        return
      };
      if(res.result.businessFields && res.result.businessFields == '1') {
        this.setData({
          modalVisible: true,
          modalType: 1,
          bindphone: res.result.phone ? res.result.phone : ''
        }, () => {
          wx.hideLoading();
        });
      } else if(res.result.businessFields && res.result.businessFields == '2') {
        this.setData({
          modalVisible: true,
          modalType: 2
        }, () => {
          wx.hideLoading();
        });
      } else {
        this.setData({
          hasData: true,
          isEdit: true,
          echoEntInfo: res.result
        }, () => {
          wx.hideLoading();
          this.toEcho();
        });
      }
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      topTabIndex: 1,
      flag: options.flag ? options.flag : 2,
      isEdit: options.isEdit ? JSON.parse(options.isEdit) : false,
      isMatch: options.isMatch ? JSON.parse(options.isMatch) : false,
      isMine: options.isMine ? JSON.parse(options.isMine) : false,
      isComplete: options.isComplete ? JSON.parse(options.isComplete) : false,
      completeTitle: options.completeTitle ? JSON.parse(options.completeTitle) : false,
      entCode: options.entCode ? options.entCode : ''
    });
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
    (async () => {
      await this.getAllDictItems();
      await setTimeout(() => {
        if(!this.data.isMine) {
          this.setData({
            entCode: wx.getStorageSync('entInfo').creditCode
          }, () => this.getEntInfo());
        } else {
          if(this.data.entCode != '') {
            this.getEntInfo();
          };
        };
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        this.setData({
          today: year + '-' + month + '-' + day,
          nowYear: year,
          pastThreeYears: year - 3,
          pastTwoYears: year - 2,
          lastYears: year - 1,
          modalType: 0,
          modalVisible: false
        });
      }, 500);
    })()
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