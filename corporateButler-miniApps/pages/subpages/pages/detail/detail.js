// pages/subpages/pages/test/test.js
import { fetch } from '../../../../utils/util.js'
import { openFile } from '../../utils/index.js'
import { baseUrl } from '../../../../utils/util.js'
const app = getApp(); //  获取小程序实例
Page({
    /**
     * 页面的初始数据
     */
    data: {
        menuTop: app.globalData.menuTop,  //  获取小程序顶部距离，适配各种手机型号对齐右上角胶囊导航栏
        menuHeight: app.globalData.menuHeight,  //  获取小程序胶囊高度
        type: '',
        detail: {},
        processList: [],
        sourceData: [],
        consultingList: [],
        evaluateScore: '',
        state: '全部',
        authorType: '',
        showWithInput: false,
        dialogTitle: '',
        consultingContext: '',
        isShow: false, // true：显示弹出框  false：隐藏弹出框
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 区分 服务管家/用户中心
        // this.data.type = options.type
        // 获取身份
        this.setData({
            authorType: options.authorType
        })
        // 获取状态
        this.setData({
            state: options.state
        })
        console.log('state', this.data.state);
        // 获取详情
        this.setData({
            detail: JSON.parse(decodeURIComponent(options.detail))
        })
        console.log('detail', this.data.detail);
        // 获取流程信息
        this.getProcessInformation(options.id, options.authorType);
        // 获取处理结果-附件
        this.getUrgeNumber(options.id)
        // 获取评价反馈内容
        this.getConsultingService(options.id);
    },
    // 获取流程信息 - 用户
    async getProcessInformation (id, authorType) {
        let res
        if (authorType == '管家') {
            res = await fetch.get('/qixian/appealProcess/mangerList', { ids: id });
        } else if (authorType == '用户') {
            res = await fetch.get('/qixian/appealProcess/list', { ids: id });
        }
        if (res.code == 200 && res.success) {
            let { result } = res
            result = result.filter(item => item.operationProcess !== null)
            this.setData({
                processList: result
            })
        }
    },
    // 获取处理结果-附件
    async getUrgeNumber (id) {
        // const res = await fetch.post('/qixian/appeal/getUrgeNumber', { id })
        const res = await fetch.post('/qixian/appeal/getAllCompleteFile', { id })
        if (res.code == 200 && res.success) {
            this.setData({
                sourceData: res.result || []
            })
        }
    },
    // 获取评价反馈-内容
    async getConsultingService () {
        const userInfo = wx.getStorageSync('userInfo')
        const res = await fetch.get('/qixian/consultingService/selectOption?userId=' + userInfo.userId + '&appealId=' + this.data.detail.id)
        if (res.code == 200 && res.success && res.result) {
            let { optionList, otherEvaluations, evaluateScore } = res.result
            const options = [
                {value: '1', name: '诉求处理结果不满意'},
                {value: '2', name: '诉求处理过程不合理'},
                {value: '3', name: '诉求处理效率太慢'},
                {value: '4', name: '业务人员专业度低'},
                {value: '5', name: '服务管家服务不满意'},
                {value: '6', name: '其他,请注明'}
            ]
            const arr = []
            options.filter(option => {
                return optionList?.forEach(item => {
                    if (option.value === item) {
                        arr.push(option);
                    }
                });
            })
            this.setData({
                consultingList: arr,
                evaluateScore
            })
            if (otherEvaluations) {
                this.setData({
                    consultingContext: otherEvaluations
                })
            }
        }
    },
    // 预览附件
    handleOpenFile (e) {
        const index = e.currentTarget.dataset.index;
        const file = this.data.detail.complaintFileList[index];
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
            openFile(file.accomplishFileUrl, file.fileName)
        } else {
            const url = baseUrl.replace('/jeecgboot', '')
            wx.previewImage({
                current: url + file.accomplishFileUrl, // 当前显示图片的http链接
                urls: [url + file.accomplishFileUrl], // 需要预览的图片http链接列表
            })
        }
    },
    // 预览附件
    handleOpenResult (e) {
        const index = e.currentTarget.dataset.index;
        const file = this.data.sourceData[index];
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
            openFile(file.accomplishFileUrl, file.fileName)
        } else {
            const url = baseUrl.replace('/jeecgboot', '')
            wx.previewImage({
                current: url + file.accomplishFileUrl, // 当前显示图片的http链接
                urls: [url + file.accomplishFileUrl], // 需要预览的图片http链接列表
            })
        }
    },
    //接受弹出框点击反馈监听事件，来进行隐藏弹出框
    clickDialog(e){
        this.setData({
            isShow: e.detail.isShow,
        })
    },
    // 退回
    onBack(e){//显示弹出框
        this.setData({
            isShow: true,
        })
        this.setData({
            dialogTitle: '退回',
        })
    },
    // 上报
    onReport () {
        const that = this
        wx.showModal({
            title: '上报',
            content: '您确定要上报信息吗？',
            success: async function (res) {
                if (res.confirm) { //这里是点击了确定以后
                    const res = await fetch.get('/qixian/appeal/escalation', { id: that.data.detail.id });
                    if (res.code == 200 && res.success) {
                        wx.showToast({
                            title: res.message,
                            icon: 'success',
                            mask: true,
                        })
                        //获取页面栈
                        let pages = getCurrentPages();
                        //获取所需页面
                        let beforePage = pages[pages.length - 2]; //上一页
                        beforePage.getAppealList(that.data.detail.state)
                        wx.navigateBack({
                            delta: 1,
                        })
                    } else {
                        wx.showToast({
                            title: res.message,
                            icon: 'error',
                            mask: true,
                        })
                    }
                } else { //这里是点击了取消以后
                    console.log('用户点击取消')
                }
            }
        })
    },
    // 接收
    onReceive () {
        const that = this
        wx.showModal({
            title: '接收',
            content: '您确定要接收信息吗？',
            success: async function (res) {
                if (res.confirm) { //这里是点击了确定以后
                    const params = {
                        appealId: that.data.detail.id,
                        departmentId: '',
                        handled: true
                    }
                    const res = await fetch.post('/qixian/appealProcess/mangerAdd', params);
                    if (res.code == 200 && res.success) {
                        wx.showToast({
                            title: res.message,
                            icon: 'success',
                            mask: true,
                        })
                        //获取页面栈
                        let pages = getCurrentPages();
                        //获取所需页面
                        let beforePage = pages[pages.length - 2]; //上一页
                        beforePage.getAppealList(that.data.detail.state)
                        wx.navigateBack({
                            delta: 1,
                        })
                    } else {
                        wx.showToast({
                            title: res.message,
                            icon: 'error',
                            mask: true,
                        })
                    }
                } else { //这里是点击了取消以后
                    console.log('用户点击取消')
                }
            }
        })
    },
    // 处理完成
    onFinish () {
        this.setData({
            isShow: true,
        })
        this.setData({
            dialogTitle: '处理完成',
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