// custom-tab-bar/index.js
const app = getApp();
Component({
  data: {
    showbar: true,
    selected: null,
    color: "#fff",
    selectedColor: "#6777FD",
    allList: {
      //  企业端tabbar
      enterpriseList: [
        {
          "pagePath": "/pages/home/home",
          "text": "首页",
          "iconPath": "../assets/imgs/tab_home.png",
          "selectedIconPath": "../assets/imgs/tab_home_active.png"
        },
        {
          "pagePath": "/pages/policyStore/policyStore",
          "text": "政策库",
          "iconPath": "../assets/imgs/tab_store.png",
          "selectedIconPath": "../assets/imgs/tab_store_active.png"
        },
        {
          "pagePath": "/pages/policyCounter/policyCounter",
          "text": "政策计算器",
          "bulge": true,
          "iconPath": "../assets/imgs/tab_calc.png",
          "selectedIconPath": "../assets/imgs/tab_calc.png"
        },
        {
          "pagePath": "/pages/accuratePush/accuratePush",
          "text": "精准推送",
          "iconPath": "../assets/imgs/tab_push.png",
          "selectedIconPath": "../assets/imgs/tab_push_active.png"
        },
        {
          "pagePath": "/pages/mine/mine",
          "text": "我的",
          "iconPath": "../assets/imgs/tab_mine.png",
          "selectedIconPath": "../assets/imgs/tab_mine_active.png"
        }
      ],
      //  管家端tabbar
      housekeep: [
        {
          "pagePath": "/pages/home/home",
          "text": "首页",
          "iconPath": "../assets/imgs/tab_home.png",
          "selectedIconPath": "../assets/imgs/tab_home_active.png"
        },
        {
          "pagePath": "/pages/policyStore/policyStore",
          "text": "政策库",
          "iconPath": "../assets/imgs/tab_store.png",
          "selectedIconPath": "../assets/imgs/tab_store_active.png"
        },
        {
          "pagePath": "/pages/accuratePush/accuratePush",
          "text": "项目库",
          "iconPath": "../assets/imgs/tab_push.png",
          "selectedIconPath": "../assets/imgs/tab_push_active.png"
        },
        {
          "pagePath": "/pages/mine/mine",
          "text": "我的",
          "iconPath": "../assets/imgs/tab_mine.png",
          "selectedIconPath": "../assets/imgs/tab_mine_active.png"
        }
      ],
      //  项目负责人端tabbar
      superintendentList: [
        {
          "pagePath": "/pages/home/home",
          "text": "首页",
          "iconPath": "../assets/imgs/tab_home.png",
          "selectedIconPath": "../assets/imgs/tab_home_active.png"
        },
        {
          "pagePath": "/pages/policyStore/policyStore",
          "text": "政策库",
          "iconPath": "../assets/imgs/tab_store.png",
          "selectedIconPath": "../assets/imgs/tab_store_active.png"
        },
        {
          "pagePath": "/pages/mine/mine",
          "text": "我的",
          "iconPath": "../assets/imgs/tab_mine.png",
          "selectedIconPath": "../assets/imgs/tab_mine_active.png"
        }
      ]
    },
    list: []
  },
  attached() {
      this.setData({
        list: this.data.allList.enterpriseList
      });
    // const roleKey = wx.getStorageSync('role');
    // console.log('roleKey:::', roleKey);
    // if(roleKey == 0) {
    //   this.setData({
    //     list: this.data.allList.enterpriseList
    //   });
    // } else if(roleKey == 1) {
    //   this.setData({
    //     list: this.data.allList.housekeep
    //   });
    // } else if(roleKey == 2) {
    //   this.setData({
    //     list: this.data.allList.superintendentList
    //   });
    // }
    // console.log('tabbar=>', this.data.list);
  },
  methods: {
    switchTab(e) {
      //如果点击当前页面则不进行跳转
      const data = e.currentTarget.dataset;
      const url = data.path;
      if (this.data.selected == data.index) {
        return false
      };
      if (wx.getStorageSync('entInfo') == null && (data.index == 2 || data.index == 3)) {
        wx.showToast({
          title: '暂未绑定，请先绑定企业~',
          icon: 'none'
        });
        return false
      };
      app.globalData.tabIndex = data.index;
      // this.setData({
      //   selected: data.index
      // });
      wx.switchTab({ url, success() {
          let page = getCurrentPages().pop();
          if(page == undefined || page == null) {
            return;
          };
          page.onLoad();
        }
      });
    }
  },
  options: {
    addGlobalClass: true
  }
})

