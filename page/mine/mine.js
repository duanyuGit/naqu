// pages/mine/mine.js

const { get_user } = require('../../util/api.js');
const util = require('../../util/util.js');
const net = require('../../util/net.js');

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
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
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUserInfo();
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  getUserInfo: function () {
    let me = this;
    let params = {};
    params.url = get_user;
    net.reqPromise(params, true).then((res) => {
      me.callbackSuccess(res);
    }, (e) => {
      // me.callbackFail(e);
    });
  },

  callbackSuccess: function (res) {
    wx.setStorageSync("user", res.user);
    this.setData({
      userInfo: res.user
    });
  }


})