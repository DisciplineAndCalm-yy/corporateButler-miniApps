// 获取应用实例
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true,
  },
  properties: {
    visible: {
      type: Boolean,
      value: false,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
    visible: false,
    firstFloor: 0, // 一级
    secondFloor: 0, // 二级
    firstValue: '', // 一级内容
    firstOptions: [
      { value: 1, label: '各级人民政府和有关部门' },
      { value: 2, label: '各级监察委员会、人民法院、人民检察院、公安机关' },
      { value: 3, label: '各级人民政府及有关部门、监察委员会、人民法院、人民检察院的工作人员' },
      { value: 4, label: '水电气热等公用企事业单位'},
      { value: 5, label: '行业协会商会'},
      { value: 6, label: '县级以上人民政府优化营商环境工作主管部门及其工作人员'},
    ],
    checked: true
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 一层选择
    handleFirstFloor(event) {
      const { value } = event.detail;
      this.setData({ 
        firstFloor: value,
        secondFloor: '',
        checked: false
      });
    },
    // 二层选择
    handleSecondFloor(event) {
      const { value } = event.detail;
      this.setData({ secondFloor: value });
    },
    // 未登录 - 遮罩层
    onVisibleChange(e) {
      this.setData({ firstFloor: 0 });
      this.triggerEvent('clickPopup', {
        visible: e.detail.visible,
      })
    },
    // 确认
    handleSubmit() {
      for (const item of this.data.firstOptions) {
        if (this.data.firstFloor == item.value) {
          this.setData({ firstValue: item.label });
        }
      }
      this.triggerEvent('clickPopup', {
        visible: false,
        firstFloor: this.data.firstValue,
        secondFloor: this.data.secondFloor,
      })
    },
  },
  options: {
  },
})
