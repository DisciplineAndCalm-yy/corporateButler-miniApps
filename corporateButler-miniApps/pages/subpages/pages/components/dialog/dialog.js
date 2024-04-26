import { fetch, baseUrl } from '../../../../../utils/util.js'
import { openFile } from '../../../utils/index.js'
Component({
  properties: {
    isShow: {// false:弹出框消息  true:弹出框显示
      value: false,
      type: Boolean
    },
    title: {// 标题
      value: '标题',
      type: String
    },
    appealId: {// 退回需要的id
      value: '',
      type: String
    },
    detailState: {// 状态值
      value: 0,
      type: Number
    },
  },
  data: {
    content: '',
    fileList: [],
    complaintList: [
      {
        value: 5,
        label: '5分',
        color: '#4181E6',
        style: 'transform: scale(0.7)',
        check: false
      },
      {
        value: 4,
        label: '4分',
        color: '#4181E6',
        style: 'transform: scale(0.7)',
        check: false
      },
      {
        value: 3,
        label: '3分',
        color: '#4181E6',
        style: 'transform: scale(0.7)',
        check: false
      },
      {
        value: 2,
        label: '2分',
        color: '#4181E6',
        style: 'transform: scale(0.7)',
        check: false
      },
      {
        value: 1,
        label: '1分',
        color: '#4181E6',
        style: 'transform: scale(0.7)',
        check: false
      }
    ],
    checkBox: [
      {value: '1', name: '诉求处理结果不满意'},
      {value: '2', name: '诉求处理过程不合理'},
      {value: '3', name: '诉求处理效率太慢'},
      {value: '4', name: '业务人员专业度低'},
      {value: '5', name: '服务管家服务不满意'},
      {value: '6', name: '其他,请注明'}
    ],
    score: '',
    showOther: false,
    showItem: false,
    inputValue: ''
  },
  methods: {
    // 确认
    submit () {
      if (this.data.title === '退回') {
        const flag = this.validate(this.data.title, this.data.content)
        if (flag) {
          this.fetchBack()
        }
      }
      if (this.data.title === '处理完成') {
        const flag = this.validate(this.data.title, this.data.content)
        if (flag) {
          this.fetchResult()
        }
      }
      if (this.data.title === '我要评价') {
        this.fetchScore()
      }
    },
    // 取消
    cancel () {
      // 退回原因置空
      this.setData({
        content: ''
      })
      // 置空文件列表
      this.setData({ 
        fileList: []
      })
      // 置空分值
      this.setData({ 
        score: ''
      })
      this.setData({ 
        showItem: false
      })
      this.setData({ 
        showOther: false
      })
      this.setData({
        checkBox: [
          {value: '1', name: '诉求处理结果不满意'},
          {value: '2', name: '诉求处理过程不合理'},
          {value: '3', name: '诉求处理效率太慢'},
          {value: '4', name: '业务人员专业度低'},
          {value: '5', name: '服务管家服务不满意'},
          {value: '6', name: '其他,请注明'}
        ]
      })
      this.setData({
        inputValue: ''
      })
      // 关闭弹框
      this.triggerEvent('clickDialog', {
        isShow: false
      });
    },
    // 退回
    async fetchBack () {
      const params = {
        opinion: this.data.content, 
        appealId: this.data.appealId,
        handled: true 
      }
      const res = await fetch.post('/qixian/appealProcess/mangerReturnAppeal', params);
      if (res.code == 200 && res.success) {
          wx.showToast({
              title: res.message,
              icon: 'success',
              mask: true,
          })
          this.triggerEvent('clickDialog', {
            isShow: false
          });
          //获取页面栈
          let pages = getCurrentPages();
          //获取所需页面
          let beforePage = pages[pages.length - 2]; //上一页
          beforePage.getAppealList('1')
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
    },
    // 处理完成
    async fetchResult () {
      const params = {
        id: this.data.appealId,
        accomplish: this.data.content,
        // accomplishFile: this.data.fileList,
      }
      // const { result } = await fetch.post('/qixian/appeal/mangerProcessing', params);
      try {
        const result = await fetch.post('/qixian/appeal/mangerProcessing', params);
        if (result) {
          const that = this;
          const uploadMethods = this.batchUpload(that.data.appealId);
          Promise.all(uploadMethods)
            .then((res) => {
              wx.showToast({
                title: '操作成功',
                icon: 'none',
                mask: true,
              })
              setTimeout(() => {
                //获取页面栈
                let pages = getCurrentPages();
                //获取所需页面
                let beforePage = pages[pages.length - 2]; //上一页
                beforePage.getAppealList(that.data.detailState)
                wx.navigateBack({
                  delta: 1,
                })
              }, 1000)
            })
            .catch((err) => {
              wx.showToast({
                title: '操作失败',
                icon: 'none',
                mask: true,
              })
              complaintDelete({ id })
            })
        }
      } catch (error) {
        wx.showToast({
          title: '操作失败',
          icon: 'none',
        })
        console.log(error)
      }
      // if (res.code == 200 && res.success) {
      //     wx.showToast({
      //         title: res.message,
      //         icon: 'success',
      //         mask: true,
      //     })
      //     this.triggerEvent('clickDialog', {
      //       isShow: false
      //     });
      // } else {
      //     wx.showToast({
      //         title: res.message,
      //         icon: 'error',
      //         mask: true,
      //     })
      // }
    },
    // 我要评价
    async fetchScore () {
      const userInfo = wx.getStorageSync('userInfo')
      let arr = []
      for (const item of this.data.checkBox) {
        console.log(item);
        if (item.checked) {
          arr.push(item.value)
        }
      }
      const params = {
        evaluateScore: this.data.score,
        userId: userInfo.userId,
        appealId: this.data.appealId,
        optionId: arr.join(), //选项id
        otherEvaluations: this.data.inputValue //其他评价
      }
      const res = await fetch.post('/qixian/myConsultingServiceEvaluate/add', params);
      if (res.code == 200 && res.success) {
          wx.showToast({
              title: res.message,
              icon: 'success',
              mask: true,
          })
          this.triggerEvent('clickDialog', {
            isShow: false
          });
      } else {
          wx.showToast({
              title: res.message,
              icon: 'error',
              mask: true,
          })
      }
      this.setData({ 
        score: ''
      })
      this.setData({ 
        showItem: false
      })
      this.setData({ 
        showOther: false
      })
      this.setData({
        checkBox: [
          {value: '1', name: '诉求处理结果不满意'},
          {value: '2', name: '诉求处理过程不合理'},
          {value: '3', name: '诉求处理效率太慢'},
          {value: '4', name: '业务人员专业度低'},
          {value: '5', name: '服务管家服务不满意'},
          {value: '6', name: '其他,请注明'}
        ]
      })
      this.setData({
        inputValue: ''
      })
    },
    validate (title, content) {
      if (title === '退回' && content === '') {
        wx.showToast({
          title: '请输入退回原因',
          icon: 'none',
          mask: true,
        })
        return false
      }
      if (title === '处理完成' && content === '') {
        wx.showToast({
          title: '请输入处理结果',
          icon: 'none',
          mask: true,
        })
        return false
      }
      if (title === '处理完成' && this.data.fileList.length == 0) {
        wx.showToast({
          title: '请上传附件',
          icon: 'none',
          mask: true,
        })
        return false
      }
      return true
    },
    // 修改-退回内容
    remarkInputAction (e) {
      console.log(e);
      this.setData({
        content: e.detail.value
      })
    },
    batchUpload(id) {
      return this.data.fileList.map((file) => {
        return this.uploadFile(file.path, id)
      })
    },
    uploadFile(path, complaintId) {
      return new Promise((resolve, reject) => {
        let token = wx.getStorageSync('token');
        wx.uploadFile({
          url: `${baseUrl}/qixian/appeal/mangerProcessingAddFile`, //仅为示例，非真实的接口地址 
          filePath: path,
          name: 'file',
          header: {
            'X-Access-Token': token,
          },
          formData: {
            id: complaintId,
          },
          success(res) {
            resolve(res)
          },
          fail(err) {
            reject(err)
          },
        })
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
        file.path.includes(fileType)
      )
      if (isFile) {
        openFile(file.path)
      } else {
        wx.previewImage({
          current: file.path, // 当前显示图片的http链接
          urls: [file.path], // 需要预览的图片http链接列表
        })
      }
    },
    handleShowUploadAction() {
      wx.showActionSheet({
        itemList: ['相册', '附件'],
        success: (res) => {
          if (res.tapIndex == 0) {
            this.handleChooseImage()
          } else {
            this.handleChooseMsgFile()
          }
        },
        fail: function (res) {
          console.log(res.errMsg)
        },
      })
    },
    handleChooseImage() {
      let that = this
      wx.chooseImage({
        count: 100, //默认9
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], //从相册选择
        success: (res) => {
          res.tempFilePaths.forEach(async (path, index) => {
            const fileData = await that.readFile(path)
            that.data.fileList.push({
              path,
              type: 'img',
              fileData: fileData.data,
              name: `文件${that.data.fileList.length + index + 1}`,
              type: 'img',
            })
            that.setData({ 
              fileList: that.data.fileList.concat()
            })
            console.log(that.data.fileList);
          })
        },
      })
    },
    handleChooseMsgFile() {
      let that = this
      wx.chooseMessageFile({
        count: 100,
        type: 'file',
        success: (res) => {
          res.tempFiles.forEach(async (file, index) => {
            const fileData = await that.readFile(file.path)
            console.log(fileData);
            that.data.fileList.push({
              path: file.path,
              type: 'file',
              fileData: fileData.data,
              name: `文件${that.data.fileList.length + index + 1}`,
            })
            that.setData({ 
              fileList: that.data.fileList.concat()
            })
            console.log(that.data.fileList)
          })
        },
      })
    },
    readFile(filePath) {
      const fs = wx.getFileSystemManager()
      return new Promise((resolve, reject) => {
        fs.readFile({
          filePath: filePath,
          encoding: 'binary',
          position: 0,
          success(res) {
            const fileTypes = [
              '.pdf',
              '.doc',
              '.docx',
              '.jpg',
              '.jpeg',
              '.png',
            ]
            const isFile = fileTypes.some((fileType) =>
              filePath.includes(fileType)
            )
            if (isFile) {
              resolve(res)
              console.log('成功');
            } else {
              wx.showToast({
                title: '仅支持上传doc、pdf文件',
                icon: 'none',
                mask: true,
              })
            }
          },
          fail(res) {
            console.log('失败');
            console.error(res)
          },
        })
      })
    },
    handleDel (e) {
      const index = e.currentTarget.dataset.index
      const file = this.data.fileList[index]
      this.data.fileList = this.data.fileList.filter(item=> item.name !== file.name)
      this.setData({
        fileList: this.data.fileList.concat()
      })
    },
    // 选择分值
    changeComplaintType (e) {
      this.setData({
        score: e.detail.value
      })
      if (e.detail.value < 4) {
        this.setData({
          showItem: true
        })
      } else {
        this.setData({
          showItem: false
        })
      }
    },
    checkboxChange(e) {
      const items = this.data.checkBox
      const values = e.detail.value
      for (let i = 0, lenI = items.length; i < lenI; ++i) {
        items[i].checked = false
        for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
          if (items[i].value === values[j]) {
            items[i].checked = true
            break
          }
        }
      }
      for (const item of items) {
        if (item.name === '其他,请注明' && item.checked) {
          this.setData({
            showOther: true
          })
        } else if (item.name === '其他,请注明' && !item.checked) {
          this.setData({
            showOther: false
          })
        }
      }
      this.setData({
        checkBox: items
      })
    },
    bindReplaceInput (e) {
      this.setData({
        inputValue: e.detail.value
      })
    }
  }
})