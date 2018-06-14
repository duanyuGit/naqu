// page/createhomestead/createhomestead.js
const scopeUtils = require('../../util/scope_utils.js');
const { publish_homestead, upload_photo } = require('../../util/api.js');
const net = require('../../util/net.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    photoPath: "",
    photoUrl:"",
    desc: "",
    locationName: "",
    locationAddress: "",
    longitude: "",
    latitude: "",

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
  create: function () {
    let me = this;
    let params = {};
    params.url = publish_homestead;
    params.data = {
      commuity_name: this.data.name,
      commuity_desc: this.data.desc,
      // commutty_url: this.data.photoUrl,
      address: this.data.locationAddress,
      longitude: this.data.longitude,
      latitude: this.data.latitude,
      
    };
    net.reqPromise(params, true).then((data) => {
      console.log("reqPromise:" + data.community);
      me.redirectToIndex(data.community);
    }, (e) => {
      me.callbackFail(e);
    });
  },
  /**
   * 添加地理位置
   */  
  addLocation: function () {
    let that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res);
        that.setData({
          locationAddress: res.address,
          locationName: res.name,
          latitude: res.latitude,
          longitude: res.longitude

        });
      }
    })
  },
  nameChanged: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  descChanged: function (e) {
    this.setData({
      desc: e.detail.value
    })
  },
  /**
   * 添加照片
   */
  addPhoto: function () {
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePath = res.tempFilePaths[0];
        that.setData({
          photoPath: tempFilePath,
        });
        that.uploadPhoto(tempFilePath);

      }
    })
  },
  /**
   * 上传照片
   */
  uploadPhoto: function (filePath) {
    let params = {};
    params.url = upload_photo;
    net.uploadPromise(filePath, params).then((res) => {
      console.log(res);
    });
  },

  redirectToIndex: function (homestead) {
    wx.setStorageSync('homestead', homestead);
    wx.switchTab({
      url: `../index/index`,
    });
  }
})