const { PULL_DOWN, PULL_NONE, PULL_UP } = require('../../util/c.js');
const { get_homestead } = require('../../util/api.js');
const util = require('../../util/util.js');
const net = require('../../util/net.js');

Page({
  data: {
    pull: PULL_NONE,
    latestArticles: [],
    imgUrls: [
      'http://pic.kekenet.com/2015/0408/12941428460233.jpg',
      'http://img.taopic.com/uploads/allimg/130203/234694-13020321300786.jpg',
      'http://img00.hc360.com/security/201602/201602041659165370.jpg'
    ],
    page: 1,
    count: 20,
    hasMore: true,
    community_id: ""
  },
  onLoad: function (options) {
    let community = wx.getStorageSync("homestead");
    this.setData({
      community_id: community.oId
    });
  },
  
  onShow:function() {
    this.loadData();
  },

  onPullDownRefresh: function () {
    this.setData({
      pull: PULL_DOWN,
      page: 1,
      hasMore: true,
    });
    this.loadData();
  },

  onReachBottom: function () {
    console.log("onReachBottom");
    if (!this.data.hasMore || (PULL_UP === this.data.pull)) {
      return;
    }
    this.setData({
      pull: PULL_UP,
      page: this.data.page++,
    });
    this.loadData();
  },

  onShareAppMessage: function () {
    return {
      title: '直接拿走你想要的，就这么简单',
      path: 'page/index/index'
    };
  },
  loadData: function () {
    let me = this;
    let params = {};
    params.url = get_homestead;
    params.data = { 
      page: this.data.page, 
      count: this.data.count,
      community_id: this.data.community_id

    };
    net.reqPromise(params, true).then((data) => {
      me.callbackSuccess(data);
    }, (e) => {
      me.callbackFail(e);
    });
  },
  /**
   * 成功获取数据后的回调
   */
  callbackSuccess: function (data) {
    let { latestArticles } = data;
    let hasMore = true;
    if (latestArticles && Array.isArray(latestArticles)) {
      if (latestArticles.length < this.data.count) {
        hasMore = false;
      }
      if (PULL_DOWN === this.data.pull) {
        wx.stopPullDownRefresh();
      } else if (PULL_UP === this.data.pull) {
        latestArticles = latestArticles.concat(this.data.latestArticles);
      }
      this.setData({
        latestArticles,
        pull: PULL_NONE,
        hasMore: hasMore,
      });
    }
  },
  /**
   * 获取数据失败后的回调
   */
  callbackFail: function (e) {
    let tips = '请求失败';
    if (PULL_DOWN === this.data.pull) {
      wx.stopPullDownRefresh();
      tips = '刷新失败';
    }
    this.setData({
      pull: PULL_NONE
    });
    util.toast(`${e.errMsg || e.serverMsg || tips}`);
  },
  goDetail: function (e) {//商品点击进详情
    let productId = e.currentTarget.dataset.productId;
    wx.navigateTo({
      url: `../product/product?product_id=${productId}`,
    });
  },
});