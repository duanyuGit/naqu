const { bind_coin_address } = require('../../util/api.js');
const net = require('../../util/net.js');
const util = require('../../util/util.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    coinAddress:""
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
  
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

  bind:function() {
    if (!this.data.coinAddress || this.data.coinAddress === '') {
      util.toast("请输入要绑定的钱包地址");
      return;
    }
    this.loadData();

  },

  loadData: function () {
    let me = this;
    let params = {};
    params.url = bind_coin_address;
    params.data = {
      wallet: this.data.coinAddress
    };
    net.reqPromise(params, true).then((res) => {
      let that = this;
      console.log(res);
      wx.redirectTo({
        url: `./withdraw?coinAddress=${that.data.coinAddress}`,
      })
    }, (e) => {
      // me.callbackFail(e);
    });
  },

  addressChanged:function(e) {
    this.setData({
      coinAddress: e.detail.value
    });
  }
})