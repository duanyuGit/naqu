
const { get_detail } = require('../../util/api.js');
const util = require('../../util/util.js');
const net = require('../../util/net.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item:null,
    detailId:"",
    imgUrls: [
      'http://pic.kekenet.com/2015/0408/12941428460233.jpg',
      'http://img.taopic.com/uploads/allimg/130203/234694-13020321300786.jpg',
      'http://img00.hc360.com/security/201602/201602041659165370.jpg'
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let detailId = options.detail_id;
    this.setData({
      detailId: detailId
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
    let user = wx.getStorageSync("user");
    if (!user) {
      wx.redirectTo({
        url: 'page/authorize/authorize',
      })
      return;
    }
    this.loadData();
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
    return {
      title: `${this.data.item.articleTags || '趣详情'}`,
      path: `page/qudetail/qudetail?detail_id=${this.data.detailId}`
    };
  },

  forward:function() {
    this.onShareAppMessage();
  },

  loadData: function() {
    let me = this;
    let params = {};
    params.url = get_detail;
    params.data = {
      articleId: this.data.detailId
    };
    net.reqPromise(params, true).then((res) => {
      console.log(res.article);
      me.setData({
        item: res.article
      });
      // me.callbackSuccess(data);
    }, (e) => {
      // me.callbackFail(e);
    });
  }

})