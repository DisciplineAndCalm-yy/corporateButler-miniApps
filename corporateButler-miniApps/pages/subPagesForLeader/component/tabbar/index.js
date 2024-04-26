// custom-tab-bar/index.js
const app = getApp();
Component({
  data: {
    showbar: true,
    selected: null,
    color: "#fff",
    selectedColor: "#6777FD",
    list: [
      {
        "pagePath": "/pages/subPagesForLeader/pages/homeLeader/homeLeader",
        "text": "首页",
        "iconPath": "../../../../assets/imgs/tab_home.png",
        "selectedIconPath": "../../../../assets/imgs/tab_home_active.png"
      },
      {
        "pagePath": "/pages/subPagesForLeader/pages/publicPolicyStore/policyStore",
        "text": "政策库",
        "iconPath": "../../../../assets/imgs/tab_store.png",
        "selectedIconPath": "../../../../assets/imgs/tab_store_active.png"
      },
      {
        "pagePath": "/pages/subPagesForLeader/pages/publicProjectStore/publicProjectStore",
        "text": "项目库",
        "iconPath": "../../../../assets/imgs/tab_project.png",
        "selectedIconPath": "../../../../assets/imgs/tab_project_active.png"
      },
      {
        "pagePath": "/pages/subPagesForLeader/pages/mineLeader/mineLeader",
        "text": "我的",
        "iconPath": "../../../../assets/imgs/tab_mine.png",
        "selectedIconPath": "../../../../assets/imgs/tab_mine_active.png"
      }
    ]
  },
  attached() {
    if(app.globalData.leaderTabIndex != null) {
      this.setData({
        selected: app.globalData.leaderTabIndex
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
      app.globalData.leaderTabIndex = data.index;
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

