// custom-tab-bar/index.js
const app = getApp();
Component({
  data: {
    showbar: true,
    selected: null,
    color: "#fff",
    selectedColor: "#6777FD",
    allList: {
      //  管家端tabbar
      housekeep: [
        {
          "pagePath": "/pages/subPagesForEcharts/pages/homeSteward/homeSteward",
          "text": "首页",
          "iconPath": "../../../../assets/imgs/tab_home.png",
          "selectedIconPath": "../../../../assets/imgs/tab_home_active.png"
        },
        {
          "pagePath": "/pages/subPagesForEcharts/pages/publicPolicyStore/policyStore",
          "text": "政策库",
          "iconPath": "../../../../assets/imgs/tab_store.png",
          "selectedIconPath": "../../../../assets/imgs/tab_store_active.png"
        },
        {
          "pagePath": "/pages/subPagesForEcharts/pages/mineSteward/mineSteward",
          "text": "我的",
          "iconPath": "../../../../assets/imgs/tab_mine.png",
          "selectedIconPath": "../../../../assets/imgs/tab_mine_active.png"
        }
      ],
      //  项目负责人端tabbar
      superintendentList: [
        {
          "pagePath": "/pages/subPagesForEcharts/pages/homeProjectmanager/homeProjectmanager",
          "text": "首页",
          "iconPath": "../../../../assets/imgs/tab_home.png",
          "selectedIconPath": "../../../../assets/imgs/tab_home_active.png"
        },
        {
          "pagePath": "/pages/subPagesForEcharts/pages/publicPolicyStore/policyStore",
          "text": "政策库",
          "iconPath": "../../../../assets/imgs/tab_store.png",
          "selectedIconPath": "../../../../assets/imgs/tab_store_active.png"
        },
        {
          "pagePath": "/pages/subPagesForEcharts/pages/publicProjectStore/publicProjectStore",
          "text": "项目库",
          "iconPath": "../../../../assets/imgs/tab_project.png",
          "selectedIconPath": "../../../../assets/imgs/tab_project_active.png"
        },
        {
          "pagePath": "/pages/subPagesForEcharts/pages/mineProjectmanager/mineProjectmanager",
          "text": "我的",
          "iconPath": "../../../../assets/imgs/tab_mine.png",
          "selectedIconPath": "../../../../assets/imgs/tab_mine_active.png"
        }
      ]
    },
    list: []
  },
  attached() {
    if(app.globalData.subTabIndex != null) {
      this.setData({
        selected: app.globalData.subTabIndex
      });
    };
    const roleKey = wx.getStorageSync('role');
    if(roleKey == 1) {
      this.setData({
        list: this.data.allList.housekeep
      });
    } else if(roleKey == 2) {
      this.setData({
        list: this.data.allList.superintendentList
      });
    };
  },
  methods: {
    switchTab(e) {
      //如果点击当前页面则不进行跳转
      const data = e.currentTarget.dataset;
      const url = data.path;
      if (this.data.selected == data.index) {
        return false
      };
      app.globalData.subTabIndex = data.index;
      this.setData({
        selected: data.index
      });
      wx.reLaunch({ url });
    }
  },
  options: {
    addGlobalClass: true
  }
})

