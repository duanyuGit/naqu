const scopeUtils = require('../../util/scope_utils.js');
const { wx_login } = require('../../util/api.js');
const net = require('../../util/net.js');
var app = getApp();
Page({
  data: {
    remind: '加载中',
    angle: 0,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  goToIndex:function(){
    let homestead = wx.getStorageSync("homestead");
    if (homestead && homestead !== "") {
      wx.switchTab({
        url: `../index/index`,
      });
    } else {
      wx.redirectTo({
        url: `../homestead/homestead`,
      })
    }
    
   
  },
  onLoad:function(){
   
  },
  onShow:function(){
   
  },
  onReady: function(){
    let token = wx.getStorageSync('login_token');
    if(token) {
      this.goToIndex();
      return;
    }
    var that = this;
    setTimeout(function(){
      that.setData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange(function(res) {
      var angle = -(res.x*30).toFixed(1);
      if(angle>14){ angle=14; }
      else if(angle<-14){ angle=-14; }
      if(that.data.angle !== angle){
        that.setData({
          angle: angle
        });
      }
    });
  },
  getUserInfo: function (e) {
    let detail = e.detail;
    let that = this;
    wx.showLoading({
      title: '微信授权中...',
    })
    scopeUtils.getUserInfo(() => {
      // 登录
      wx.login({
        success: res => {
          let params = {};
          params.url = wx_login;
          params.data = { 
            code: res.code,
            encryptedData: encodeURIComponent(detail.encryptedData),
            iv: encodeURIComponent(detail.iv),
          };
          net.reqPromise(params).then((res) => {
            wx.setStorageSync('login_userid', res.user.oId);
            wx.setStorageSync('login_token', res.token);
            that.goToIndex();
           
          });
        }
      })
    });
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
});