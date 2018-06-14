// page/withdraw/withdraw.js
const { with_draw } = require('../../util/api.js');
const net = require('../../util/net.js');
const util = require('../../util/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coinAddress:"",
    amount:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let user = wx.getStorageSync("user");
    console.log("user=" + user.userWalletAddress);
    this.setData({
      coinAddress: user.userWalletAddress
    });
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

  countChanged:function(e) {
    let value = e.detail.value;
    this.setData({
      coinAddress:value
    });
  },

  loadData: function () {
    let me = this;
    let params = {};
    params.url = with_draw;
    params.data = {
      amount: this.data.coinAddress
    };
    net.reqPromise(params, true).then((data) => {
      console.log(data);
      wx.navigateBack({
        delta: 1
      })
    }, (e) => {
      // me.callbackFail(e);
    });
  },

  withdraw:function() {

    if (this.data.coinAddress <= 0) {
      util.toast("提取金额需要大于0");
      return;
    }
    this.loadData();

  }


})