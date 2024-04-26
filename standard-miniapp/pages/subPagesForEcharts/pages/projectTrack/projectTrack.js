// pages/subPagesForEcharts/pages/projectTrack/projectTrack.js
import { fetch, baseUrl } from '../../../../utils/util.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuHeight: app.globalData.menuHeight,
    menuTop: app.globalData.menuTop,
    projectId: '',
    projectInfo: {},
    yearPlanInfo: {},
    planDataList: [],
    isPoint: false,
    visible: false,
    today: '',
    nowMonth: 0,
    tabIndex: 0,
    Q1Expend: false,
    Q2Expend: false,
    Q3Expend: false,
    Q4Expend: false,
    nowMontId: '',
    nowInvestValue: '',
    accInvestValue: '',
    progressValue: '',

    JanId: '',
    JanNowInvest: '',
    JanAccInvest: '',
    JanProgress: '',

    FebId: '',
    FebNowInvest: '',
    FebAccInvest: '',
    FebProgress: '',

    MarId: '',
    MarNowInvest: '',
    MarAccInvest: '',
    MarProgress: '',

    AprId: '',
    AprNowInvest: '',
    AprAccInvest: '',
    AprProgress: '',

    MayId: '',
    MayNowInvest: '',
    MayAccInvest: '',
    MayProgress: '',

    JunId: '',
    JunNowInvest: '',
    JunAccInvest: '',
    JunProgress: '',

    JulId: '',
    JulNowInvest: '',
    JulAccInvest: '',
    JulProgress: '',

    AugId: '',
    AugNowInvest: '',
    AugAccInvest: '',
    AugProgress: '',

    SepId: '',
    SepNowInvest: '',
    SepAccInvest: '',
    SepProgress: '',

    OctId: '',
    OctNowInvest: '',
    OctAccInvest: '',
    OctProgress: '',

    NovId: '',
    NovNowInvest: '',
    NovAccInvest: '',
    NovProgress: '',

    DecId: '',
    DecNowInvest: '',
    DecAccInvest: '',
    DecProgress: '',

    popupIndex: 0,
    proceduresList: [],
    procedures: [],
    proceduresOptions: [],
    proceduresOptionsMap: {},
    proceduresSearchValue: '',
    isImportant: true,
    canNotSave: false
  },

  getProjectData() {
    wx.showLoading({
      title: '加载中',
    });
    fetch.get('/project/projectInfo/queryById', { id: this.data.projectId }).then(res => {
      this.setData({
        projectInfo: res.result
      }, () => {
        wx.hideLoading();
      });
    });
  },

  getYearPlan() {
    wx.showLoading({
      title: '加载中',
    });
    fetch.get('/project/projectInfo/getAnnualInvestmentPlanVo', { projectInfoId: this.data.projectId }).then(res => {
      this.setData({
        yearPlanInfo: res.result
      }, () => {
        wx.hideLoading();
      });
    });
  },

  getPlanDataList() {
    wx.showLoading({
      title: '加载中',
    });
    fetch.get('/project/projectPromotionPlan/list', { projectInfoId: this.data.projectId }).then(res => {
      this.setData({
        planDataList: res.result
      }, () => {
        this.dealPlanList();
        wx.hideLoading();
      });
    });
  },

  dealPlanList() {
    const datas = this.data.planDataList;
    datas.map(el => {
      if(el.monthStr == '1月') {
        this.setData({
          JanId: el.id,
          JanNowInvest: el.curMonthInvest,
          JanAccInvest: el.curMonthTotalInvest,
          JanProgress: el.curMonthImageProgress
        });
      };
      if(el.monthStr == '2月') {
        this.setData({
          FebId: el.id,
          FebNowInvest: el.curMonthInvest,
          FebAccInvest: el.curMonthTotalInvest,
          FebProgress: el.curMonthImageProgress
        });
      };
      if(el.monthStr == '3月') {
        this.setData({
          MarId: el.id,
          MarNowInvest: el.curMonthInvest,
          MarAccInvest: el.curMonthTotalInvest,
          MarProgress: el.curMonthImageProgress
        });
      };
      if(el.monthStr == '4月') {
        this.setData({
          AprId: el.id,
          AprNowInvest: el.curMonthInvest,
          AprAccInvest: el.curMonthTotalInvest,
          AprProgress: el.curMonthImageProgress
        });
      };
      if(el.monthStr == '5月') {
        this.setData({
          MayId: el.id,
          MayNowInvest: el.curMonthInvest,
          MayAccInvest: el.curMonthTotalInvest,
          MayProgress: el.curMonthImageProgress
        });
      };
      if(el.monthStr == '6月') {
        this.setData({
          JunId: el.id,
          JunNowInvest: el.curMonthInvest,
          JunAccInvest: el.curMonthTotalInvest,
          JunProgress: el.curMonthImageProgress
        });
      };
      if(el.monthStr == '7月') {
        this.setData({
          JulId: el.id,
          JulNowInvest: el.curMonthInvest,
          JulAccInvest: el.curMonthTotalInvest,
          JulProgress: el.curMonthImageProgress
        });
      };
      if(el.monthStr == '8月') {
        this.setData({
          AugId: el.id,
          AugNowInvest: el.curMonthInvest,
          AugAccInvest: el.curMonthTotalInvest,
          AugProgress: el.curMonthImageProgress
        });
      };
      if(el.monthStr == '9月') {
        this.setData({
          SepId: el.id,
          SepNowInvest: el.curMonthInvest,
          SepAccInvest: el.curMonthTotalInvest,
          SepProgress: el.curMonthImageProgress
        });
      };
      if(el.monthStr == '10月') {
        this.setData({
          OctId: el.id,
          OctNowInvest: el.curMonthInvest,
          OctAccInvest: el.curMonthTotalInvest,
          OctProgress: el.curMonthImageProgress
        });
      };
      if(el.monthStr == '11月') {
        this.setData({
          NovId: el.id,
          NovNowInvest: el.curMonthInvest,
          NovAccInvest: el.curMonthTotalInvest,
          NovProgress: el.curMonthImageProgress
        });
      };
      if(el.monthStr == '12月') {
        this.setData({
          DecId: el.id,
          DecNowInvest: el.curMonthInvest,
          DecAccInvest: el.curMonthTotalInvest,
          DecProgress: el.curMonthImageProgress
        });
      };
      if(el.monthStr.indexOf(this.data.nowMonth) != -1) {
        this.setData({
          nowMontId: el.id,
          nowInvestValue: el.curMonthInvest,
          accInvestValue: el.curMonthTotalInvest,
          progressValue: el.curMonthImageProgress
        });
      };
    });
  },

  getProjectProgressList() {
    wx.showLoading({
      title: '加载中',
    });
    fetch.get('/project/projectFlowTrace/listBuildChild', { projectInfoId: this.data.projectId }).then(res => {
      let mapObj = {};
      let list = res.result;
      list.map(el => {
        el.isMust = true;
        el.isEdit = el.completeStatus == 1 ? true : false;
        el.isExpend = el.completeStatus == 1 ? true : false;
        el.fileList = [];
        if(el.pathList != null) el.pathList.map(e => el.fileList.push(baseUrl.replace('/jeecgboot', '') + e.tempPath));
        if(el.childrenList != null) {
          el.childrenList.splice(0, 1);
          el.childrenList.map(item => {
            item.isMust = false;
            item.checked = false;
            item.isEdit = item.completeStatus == 1 ? true : false;
            item.isExpend = item.completeStatus == 1 ? true : false;
            item.fileList = [];
            if(item.pathList != null) item.pathList.map(e => item.fileList.push(baseUrl.replace('/jeecgboot', '') + e.tempPath));
            item.childrenList = [];
          });
          mapObj[el.flowTaskId] = el.childrenList;
        } else {
          el.childrenList = [];
        };
      });
      console.log(list);
      list = this.dealProgressData(this.flatData(list));
      this.setData({
        proceduresList: list,
        proceduresOptionsMap: mapObj
      }, () => {
        wx.hideLoading();
      });
    });
  },

  flatData(arr) {
    return [].concat(...arr.map(item => [].concat(item, ...this.flatData(item.childrenList))));
  },

  dealProgressData(arr) {
    let list = arr.filter(el => {
      return el.isMust || (!el.isMust && el.completeStatus == 1);
    });
    return list;
  },

  toProjectTrackOneKey(e) {
    wx.navigateTo({
      url: '/pages/subPagesForEcharts/pages/projectTrackOneKey/projectTrackOneKey?projectId='+e.currentTarget.dataset.id
    });
  },

  changeTabs(e) {
    this.setData({
      tabIndex: e.currentTarget.dataset.index
    });
  },

  changeExpend(e) {
    switch(e.currentTarget.dataset.id) {
      case '1':
        this.setData({
          Q1Expend: !this.data.Q1Expend
        });
        break;
      case '2':
        this.setData({
          Q2Expend: !this.data.Q2Expend
        });
        break;
      case '3':
        this.setData({
          Q3Expend: !this.data.Q3Expend
        });
        break;
      case '4':
        this.setData({
          Q4Expend: !this.data.Q4Expend
        });
        break;
      default:
        break;
    }
  },

  nowInvest(e) {
    this.setData({
      nowMontId: e.currentTarget.dataset.id,
      nowInvestValue: e.detail.value
    });
    switch(e.currentTarget.dataset.months) {
      case '1':
        this.setData({
          JanNowInvest: e.detail.value
        });
        break;
      case '2':
        this.setData({
          FebNowInvest: e.detail.value
        });
        break;
      case '3':
        this.setData({
          MarNowInvest: e.detail.value
        });
        break;
      case '4':
        this.setData({
          AprNowInvest: e.detail.value
        });
        break;
      case '5':
        this.setData({
          MayNowInvest: e.detail.value
        });
        break;
      case '6':
        this.setData({
          JunNowInvest: e.detail.value
        });
        break;
      case '7':
        this.setData({
          JulNowInvest: e.detail.value
        });
        break;
      case '8':
        this.setData({
          AugNowInvest: e.detail.value
        });
        break;
      case '9':
        this.setData({
          SepNowInvest: e.detail.value
        });
        break;
      case '10':
        this.setData({
          OctNowInvest: e.detail.value
        });
        break;
      case '11':
        this.setData({
          NovNowInvest: e.detail.value
        });
        break;
      case '12':
        this.setData({
          DecNowInvest: e.detail.value
        });
        break;
      default:
        break;
    };
  },

  accInvest(e) {
    this.setData({
      nowMontId: e.currentTarget.dataset.id,
      accInvestValue: e.detail.value
    });
    switch(e.currentTarget.dataset.months) {
      case '1':
        this.setData({
          JanAccInvest: e.detail.value
        });
        break;
      case '2':
        this.setData({
          FebAccInvest: e.detail.value
        });
        break;
      case '3':
        this.setData({
          MarAccInvest: e.detail.value
        });
        break;
      case '4':
        this.setData({
          AprAccInvest: e.detail.value
        });
        break;
      case '5':
        this.setData({
          MayAccInvest: e.detail.value
        });
        break;
      case '6':
        this.setData({
          JunAccInvest: e.detail.value
        });
        break;
      case '7':
        this.setData({
          JulAccInvest: e.detail.value
        });
        break;
      case '8':
        this.setData({
          AugAccInvest: e.detail.value
        });
        break;
      case '9':
        this.setData({
          SepAccInvest: e.detail.value
        });
        break;
      case '10':
        this.setData({
          OctAccInvest: e.detail.value
        });
        break;
      case '11':
        this.setData({
          NovAccInvest: e.detail.value
        });
        break;
      case '12':
        this.setData({
          DecAccInvest: e.detail.value
        });
        break;
      default:
        break;
    };
  },

  progressBlur(e) {
    this.setData({
      nowMontId: e.currentTarget.dataset.id,
      progressValue: e.detail.value
    });
    switch(e.currentTarget.dataset.months) {
      case '1':
        this.setData({
          JanProgress: e.detail.value
        });
        break;
      case '2':
        this.setData({
          FebProgress: e.detail.value
        });
        break;
      case '3':
        this.setData({
          MarProgress: e.detail.value
        });
        break;
      case '4':
        this.setData({
          AprProgress: e.detail.value
        });
        break;
      case '5':
        this.setData({
          MayProgress: e.detail.value
        });
        break;
      case '6':
        this.setData({
          JunProgress: e.detail.value
        });
        break;
      case '7':
        this.setData({
          JulProgress: e.detail.value
        });
        break;
      case '8':
        this.setData({
          AugProgress: e.detail.value
        });
        break;
      case '9':
        this.setData({
          SepProgress: e.detail.value
        });
        break;
      case '10':
        this.setData({
          OctProgress: e.detail.value
        });
        break;
      case '11':
        this.setData({
          NovProgress: e.detail.value
        });
        break;
      case '12':
        this.setData({
          DecProgress: e.detail.value
        });
        break;
      default:
        break;
    };
  },

  searchBlurs(e) {
    this.setData({
      proceduresSearchValue: e.detail.value
    });
  },

  toSearch() {
    console.log(this.data);
  },
  
  onImportantChange(e) {
    this.setData({
      isImportant: e.detail.checked
    });
  },

  onRadioChange(e) {
    const index = e.currentTarget.dataset.index;
    let list = this.data.proceduresOptions;
    list[index].checked = e.detail.checked;
    this.setData({
      proceduresOptions: list
    });
  },

  openPopup(e) {
    const index = e.currentTarget.dataset.index;
    const flowTaskId = e.currentTarget.dataset.flowtaskid;
    this.setData({
      popupIndex: index,
      proceduresOptions: this.data.proceduresOptionsMap[flowTaskId],
      visible: true
    });
  },

  toDeleteCard(e) {
    let list = this.data.proceduresList;
    list.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      proceduresList: list
    });
  },

  // 弹出层
  onVisibleChange(e) {
    this.setData({
      visible: e.detail.visible
    });
  },

  cancelPopup() {
    this.setData({
      visible: false
    });
  },

  confirmPopup(e) {
    let list = this.data.proceduresOptions.filter(el => el.checked == true);
    let newList = [...this.data.proceduresList];
    const n = this.data.popupIndex + 1;
    list.map(el => newList.splice(n, 0, el));
    let obj = {};
    newList = newList.reduce((newArr, next) => {
      obj[next.flowTaskId] ? "" : (obj[next.flowTaskId] = true && newArr.push(next));
      return newArr;
    }, []);
    newList = newList.filter(el => el.checked == undefined || el.checked == true);
    this.setData({
      visible: false,
      proceduresList: newList
    });
  },

  changeProceduresExpend(e) {
    const index = e.currentTarget.dataset.index;
    let list = this.data.proceduresList;
    list[index].isExpend = !list[index].isExpend;
    this.setData({
      proceduresList: list
    });
  },

  dateChange(e) {
    const index = e.currentTarget.dataset.index;
    let list = this.data.proceduresList;
    list[index].isEdit = true;
    list[index].approvalTime = e.detail.value;
    this.setData({
      proceduresList: list
    });
  },

  inputBlur(e) {
    const index = e.currentTarget.dataset.index;
    let list = this.data.proceduresList;
    list[index].isEdit = true;
    list[index].approvalNum = e.detail.value;
    this.setData({
      proceduresList: list
    });
  },

  textAreaBlur(e) {
    const index = e.currentTarget.dataset.index;
    let list = this.data.proceduresList;
    list[index].isEdit = true;
    list[index].remark = e.detail.value;
    this.setData({
      proceduresList: list
    });
  },

  switchChange(e) {
    const index = e.currentTarget.dataset.index;
    let list = this.data.proceduresList;
    list[index].isComplete = e.detail.value;
    this.setData({
      proceduresList: list
    });
  },

  // 上传图片
  chooseImg: function (e) {
    const index = e.currentTarget.dataset.index;
    const that = this;
    let proceduresList = this.data.proceduresList
    proceduresList[index].isEdit = true;
    let fileList = proceduresList[index].pathList || [];
    if (fileList.length >= 5) {
      wx.showToast({
        icon: 'error',
        title: '最多上传五张图片'
      });
      return
    };
    wx.showLoading({
      title: '上传中...'
    });
    this.setData({
      canNotSave: true
    }, () => {
      wx.chooseMedia({
        // count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          fetch.upload('/sys/common/upload', res.tempFiles[0].tempFilePath, { biz: 'temp' }).then(resolve => {
            wx.hideLoading();
            if(resolve.code == 200) {
              let pathList = proceduresList[index].pathList || [];
              pathList.push(resolve.result);
              proceduresList[index].pathList = pathList;
              wx.showToast({
                title: resolve.message,
                icon: 'none'
              });
              that.setData({
                proceduresList: proceduresList
              });
            };
            that.setData({
              canNotSave: false
            });
          });
          let tempFiles = res.tempFiles;
          let fileList = proceduresList[index].fileList;
          for(let i = 0; i < tempFiles.length; i++) {
            if(fileList.length >= 9) {
              proceduresList[index].fileList = fileList;
              that.setData({
                proceduresList: proceduresList
              });
              return false;
            } else {
              fileList.push(tempFiles[i].tempFilePath);
            }
          };
          proceduresList[index].fileList = fileList;
          that.setData({
            proceduresList: proceduresList
          });
        },
        fail: () => {
          wx.hideLoading();
          this.setData({
            canNotSave: false
          });
        },
        complete: () => {}
      });
    });
  },

  // 删除图片
  deleteImg: function (e) {
    const index = e.currentTarget.dataset.pindex;
    const idx = e.currentTarget.dataset.index;
    let proceduresList = this.data.proceduresList;
    let fileList = proceduresList[index].fileList || [];
    let pathList = proceduresList[index].pathList || [];
    fileList.splice(idx, 1);
    pathList.splice(idx, 1);
    this.setData({
      proceduresList: proceduresList
    });
  },

  // 预览图片
  previewImg: function (e) {
    const that = this;
    //获取当前图片的下标
    const index = e.currentTarget.dataset.pindex;
    const idx = e.currentTarget.dataset.index;
    //所有图片
    const proceduresList = this.data.proceduresList;
    const fileList = proceduresList[index].fileList;
    wx.previewImage({
      //当前显示图片
      current: fileList[idx],
      //所有图片
      urls: fileList,
      complete(res) {
      }
    });
  },

  checkTime() {
    let list = this.data.proceduresList.filter(el => el.isEdit);
    const timestampArray = list.map(({ approvalTime }) => Date.parse(approvalTime));
    for(let i = 0; i < timestampArray.length - 1; i++) {
      if(timestampArray[i] > timestampArray[i + 1]) {
        wx.showToast({
          title: '流程时间不规则！',
          icon: 'none'
        });
        return false;
      };
    };
    return true;
  },

  toSaveData() {
    if(!this.checkTime()) return
    wx.showLoading({
      title: '保存中...'
    });
    let list = this.data.proceduresList.filter(el => el.isEdit);
    list.map(el => {
      el.fileSaveVoList = el.pathList;
      el.projectInfoId = this.data.projectId;
    });
    const params = {
      projectId: this.data.projectId,
      flowTraceSaveVoList: list,
      projectPromotionPlanSaveVo: {
        id: this.data.nowMontId,
        curMonthInvest: this.data.nowInvestValue,
        curMonthImageProgress: this.data.progressValue
      }
    };
    console.log(params);
    fetch.post('/project/projectFlowTrace/addFlowTraceAndProPlan', params).then(res => {
      wx.hideLoading();
      if(res.code == 200) {
        wx.showToast({
          title: res.message,
          icon: 'none'
        });
        setTimeout(() => {
          // this.getProjectData();
          // this.getYearPlan();
          // this.getPlanDataList();
          // this.getProjectProgressList();
          wx.reLaunch({
            url: '/pages/subPagesForEcharts/pages/publicProjectStore/publicProjectStore'
          });
        }, 1500);
      };
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      projectId: options.id ? options.id : '',
      isPoint: options.isPoint ? options.isPoint : false
    });
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    this.setData({
      today: year + '-' + month + '-' + day,
      nowMonth: this.data.isPoint ? 0 : month,
      Q1Expend: month < 4 ? true : false,
      Q2Expend: month < 7 && month > 3 ? true : false,
      Q3Expend: month < 10 && month > 6 ? true : false,
      Q4Expend: month > 9 ? true : false
    });
    this.getProjectData();
    this.getYearPlan();
    this.getPlanDataList();
    this.getProjectProgressList();
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