// page/publish/publish.js

const { upload_photo, upload } = require('../../util/api.js');
const net = require('../../util/net.js');
const scopeUtils = require('../../util/scope_utils.js');
import WxValidate from '../../assets/plugins/wx-validate/WxValidate';
const util = require('../../util/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    photoPath: "",
    // 选中的地理位置信息
    locationResponse: "",
    homestead:null,
    // 选中的家园名称
    homesteadName: "",
    imageUrl:"",
    //宝贝描述
    desc:""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let homestead = wx.getStorageSync("homestead");
    this.setData({
      homestead: homestead,
      homesteadName: homestead.commuity_name,
    });
    this.initValidate();
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

  initValidate: function() {
    let that = this;
    // 验证字段的规则
    const rules = {
      photoPath: {
        required: true,
      },
     
      homesteadName: {
        required: true,
      },
      
      desc: {
        required: true,
      }
    }
    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      photoPath: {
        required: '请添加照片',
      },
      homesteadName: {
        required: '请选择家园',
      },
      desc: {
        required: '请描述下您的宝贝',
      },
      
    }
    // 创建实例对象
    this.WxValidate = new WxValidate(rules, messages)
    
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
    let that = this;
    let key = [];
    params.url = upload_photo;
    net.uploadPromise(filePath, params).then((res) => {
      console.log(res);
      key = res.key;
      that.setData({
        imageUrl: key[0],
      });
    });
  },

  /**
   * 添加地理位置
   */
  addLocation: function() {
    // let that = this;
    // scopeUtils.chooseLocation(() => {
    //   wx.chooseLocation({
    //     success: function (res) {
    //       console.log(res);
    //       that.setData({
    //         locationResponse: res,
    //         homesteadName: res.name
    //       });
    //     }
    //   })

    // });
  },

/**
 * 确认发布
 */
  confirm_publish:function(e) {
    // 传入表单数据，调用验证方法
    // if (!this.WxValidate.checkForm(e)) {
    //   const error = this.WxValidate.errorList[0]
    //   util.toast(error.msg);
    //   console.log(error.msg);
    //   return false
    // }
    if (!this.data.imageUrl) {
      util.toast("请添加图片");
      return;
    }
    if(!this.data.desc) {
      util.toast("请添加描述");
      return;
    }

    this.publish();

  },


  publish: function () {
    let me = this;
    let params = {};
    params.url = upload;
    params.data = {
      articleTitle: this.data.homesteadName + "_" + new Date().getTime(),
      articleTags:this.data.desc,
      articleContent: this.data.imageUrl,
      communityId: this.data.homestead.oId

    };
    net.reqPromise(params, true).then((data) => {
      me.callbackSuccess(data);
    }, (e) => {
      // me.callbackFail(e);
    });
  },

  nameChanged: function (e) {
    this.setData({
      desc: e.detail.value
    })
  },

  callbackSuccess: function (data) {
    this.setData({
      imageUrl:"",
      photoPath:"",
      desc:""
    });
    wx.switchTab({
      url: `../index/index`,
    });
    
  }




})