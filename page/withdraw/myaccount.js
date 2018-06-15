// page/withdraw/myaccount.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tokenAmount: 0,
    user: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let user = wx.getStorageSync("user");
    console.log("user=" + user.token_amount);
    this.setData({
      tokenAmount: user.token_amount,
      user: user
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
  withdraw: function () {
    let userWalletAddress = this.data.user.userWalletAddress;
    if (userWalletAddress && userWalletAddress !== '') {
      wx.navigateTo({
        url: `./withdraw`,
      })
    } else {
      wx.navigateTo({
        url: `./accountbind`,
      })
    }

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

})