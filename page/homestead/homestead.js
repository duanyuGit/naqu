// page/homestead/homestead.js
const scopeUtils = require('../../util/scope_utils.js');
const { get_communities } = require('../../util/api.js');
const net = require('../../util/net.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    homesteadList: [],
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.loadData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  loadData: function () {
    let that = this;
    let params = {};
    params.url = get_communities;
    net.reqPromise(params, true).then((data) => {
      let homesteadList = data.communities;
      that.setData({
        homesteadList: homesteadList
      });
      console.log(homesteadList);
      // me.callbackSuccess(data);
    }, (e) => {
      // me.callbackFail(e);
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  create: function() {
    wx.navigateTo({
      url: `../createhomestead/createhomestead`,
    })
  },
  chooseHomestead: function (e) {
    let homestead = e.currentTarget.dataset.homestead;
    wx.setStorageSync('homestead', homestead);
    wx.switchTab({
      url: `../index/index`,
    });
  },


})