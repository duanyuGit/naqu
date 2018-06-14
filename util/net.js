const { DEBUG, CODE_NOT_LOGIN, CODE_NEED_AUTH_UNIONID } = require('./c.js');
const md5 = require('./md5.js');
const util = require('./util.js');
const { wx_login } = require('./api.js');
/**
 * 网络请求对象
 */
const net = {
  commonParams: {//通用请求参数，无需参与签名
    client_id: '',//手机硬件设备信息拼接成的唯一标识
    source: 'weapp',//调接口的来源，微信小程序(weapp)
  },
  commonParamsSign: {//通用请求参数，需要参与签名
    channel: '',//渠道标识
    sm_device_id: '',//设备id
    version: '1.0.5',//版本
    version_code: '105',//版本号
  },
  getCommand: function (url) {//获取请求url的command
    //比如url='https://mobileapi.bainianaolai.com/c2c/get_user_info';则command=get_user_info
    try {
      if (!url) {
        return '';
      }
      url = new String(url);
      url = url.split('?')[0];
      return url.substring(url.lastIndexOf('/') + 1, url.length);
    } catch (e) {
      DEBUG && console.log(`getCommand() exception:${JSON.stringify(e)}`);
      return '';
    }
  },
  createSign: function (params) {//将请求参数签名处理
    let keys = [];
    for (let p in params) {
      keys.push(p);
    }
    for (let p in this.commonParamsSign) {
      keys.push(p);
    }
    keys = Array.from(new Set(keys.sort()));//数组排序并且去重复
    let s = '';
    for (let i = 0, n = keys.length; i < n; i++) {
      let k = keys[i];
      s += ('undefined' !== typeof params[k]) ? params[k] : this.commonParamsSign[k];
    }
    return md5(s);
  },
  req: function (params, success, error) {//get或post请求
    if (!params) {
      util.toast(`请设置请求参数`);
      return;
    }
    if (!params.url) {
      util.toast(`请设置请求url`);
      return;
    }
    params.data = { ...params.data };
    let user_id = '';
    let token = '';
    try {
      user_id = params.data.user_id || wx.getStorageSync('login_userid');
      token = wx.getStorageSync('login_token');
    } catch (e) {
      user_id = '';
      token = '';
      DEBUG && console.log(`getStorgaeSync() exception:${JSON.stringify(e)}`);
    }
    params.data.user_id = user_id;
    params.data.token = token;
    params.data.timestamp = (new Date()).valueOf();
    params.data.command = this.getCommand(params.url);
    params.data.sign = this.createSign(params.data);
    Object.assign(params.data, this.commonParams, this.commonParamsSign);

    wx.request({
      url: params.url,
      data: params.data || '',
      header: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      method: params.method || 'POST',
      dataType: params.dataType || 'json',
      success: function (res) {
        let data = res.data;
        if (0 === data.errorCode) {//ok
          if (success) {
            success(data);
          }
        } else if (CODE_NOT_LOGIN === data.errorCode) {//未登录
          DEBUG && console.log(`Request for ${params.url} exception.--->${JSON.stringify(data.serverMsg)}`);
          wx.clearStorage();
          util.toast(`您的用户信息已失效，请重新操作`, 2000, () => {
            wx.reLaunch({
              url: '/page/index/index'
            });
          });
        } else {
          DEBUG && console.log(`Request for ${params.url} exception.--->${JSON.stringify(data.serverMsg)}`);
          if (error) {
            error(data);
          } else {
            util.toast(`${data.serverMsg}`);
          }
        }
      },
      fail: function (e) {
        DEBUG && console.log(`Request for ${params.url} fail.--->${JSON.stringify(e)}`);
        if (error) {
          error(e);
        } else {
          util.toast(`${e.errMsg}`);
        }
      },
      complete: function (res) {
        DEBUG && console.log(`Request for ${params.url} complete.--->${JSON.stringify(res)}`);
      }
    });
    wx.hideLoading();
  },
  //dealfail是否手动处理异常，是：true
  reqPromise: function (params, dealfail) {//get或post请求
    if (!params) {
      util.toast(`请设置请求参数`);
      return;
    }
    if (!params.url) {
      util.toast(`请设置请求url`);
      return;
    }
    params.data = { ...params.data };
    let user_id = '';
    let token = '';
    try {
      user_id = params.data.user_id || wx.getStorageSync('login_userid');
      token = wx.getStorageSync('login_token');
    } catch (e) {
      user_id = '';
      token = '';
      DEBUG && console.log(`getStorgaeSync() exception:${JSON.stringify(e)}`);
    }
    params.data.user_id = user_id;
    params.data.token = token;
    params.data.timestamp = (new Date()).valueOf();
    params.data.command = this.getCommand(params.url);
    params.data.sign = this.createSign(params.data);
    Object.assign(params.data, this.commonParams, this.commonParamsSign);
    let promise = new Promise(function (resolve, reject) {
      wx.request({
        url: params.url,
        data: params.data || '',
        header: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        method: params.method || 'POST',
        dataType: params.dataType || 'json',
        success: function (res) {
          let data = res.data;
          if (0 === data.code) {//ok
            resolve(res.data);
          } else if (CODE_NOT_LOGIN === data.code) {//未登录
            DEBUG && console.log(`Request for ${params.url} exception.--->${JSON.stringify(data.serverMsg)}`);
            wx.clearStorage();
            util.toast(`您的用户信息已失效，请重新操作`, 2000, () => {
              wx.reLaunch({
                url: '/page/index/index'
              });
            });
          } else {
            DEBUG && console.log(`Request for ${params.url} exception.--->${JSON.stringify(data.serverMsg)}`);
            if (dealfail) {
              reject(data);
            } else {
              util.toast(`${data.serverMsg}`);
            }
          }
        },
        fail: function (e) {
          DEBUG && console.log(`Request for ${params.url} fail.--->${JSON.stringify(e)}`);
          if (dealfail) {
            reject(e);
          } else {
            util.toast(`${e.errMsg}`);
          }
        },
        complete: function (res) {
          DEBUG && console.log(`Request for ${params.url} complete.--->${JSON.stringify(res)}`);
        }
      });
    });
    wx.hideLoading();
    return promise;
  },
  login: function (success, error) {
    //获取code
    net.wxlogin(success, error);

  },
  wxlogin: (succ, error, needUser) => {//needUser是否需要用户授权
    wx.login({
      success: (res) => {//获取code
        let code = res.code;
        wx.getUserInfo({
          withCredentials: true,
          lang: 'zh_CN',
          success: (res) => {
            net.bindUserInfo(code, res, succ);
          },
          fail: function (e) {
            DEBUG && console.log(`Request for ${params.url} fail.--->${JSON.stringify(e)}`);
            net.showSettingDialog(e);
          },
          complete: function (res) {
            DEBUG && console.log(`Request for ${params.url} complete.--->${JSON.stringify(res)}`);
          }
        });

      },
      fail: function (e) {
        DEBUG && console.log(`Request for ${params.url} fail.--->${JSON.stringify(e)}`);
        util.toast(`${e.errMsg}`);
      },
      complete: function (res) {
        DEBUG && console.log(`Request for ${params.url} complete.--->${JSON.stringify(res)}`);
      }
    });
  },



  /**
   * 上传文件
   * @params filePath 文件路径
   * @params params formData参数
   */
  uploadPromise: function (filePath,params) {
    if (!params) {
      util.toast(`请设置请求参数`);
      return;
    }
    if (!params.url) {
      util.toast(`请设置请求url`);
      return;
    }
    params.data = { ...params.data };
    let user_id = '';
    let token = '';
    try {
      user_id = params.data.user_id || wx.getStorageSync('login_userid');
      token = wx.getStorageSync('login_token');
    } catch (e) {
      user_id = '';
      token = '';
      DEBUG && console.log(`getStorgaeSync() exception:${JSON.stringify(e)}`);
    }
    params.data.user_id = user_id;
    params.data.token = token;
    params.data.timestamp = (new Date()).valueOf();
    params.data.command = this.getCommand(params.url);
    params.data.sign = this.createSign(params.data);
    Object.assign(params.data, this.commonParams, this.commonParamsSign);
    let promise = new Promise(function (resolve, reject) {
      wx.uploadFile({
        url: params.url,
        filePath: filePath,//要上传文件资源的路径
        name: 'file', //文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
        formData: params.data || '', //HTTP 请求中其他额外的 form data
        header: { "Content-Type": "multipart/form-data" },
        success: res => {
          if (res.statusCode == 200) {
            resolve(JSON.parse(res.data));
          } else {
            reject(JSON.parse(res.data));
          }

        },
        fail: error => {
          reject(error);
          DEBUG && console.log(`Request for ${params.url} fail.--->${JSON.stringify(e)}`);
          util.toast(`${error.errMsg}`);
        },
        complete: res => {
          DEBUG && console.log(`upload for ${params.url} complete.--->${JSON.stringify(res)}`);
        }
      })
    });
    return promise;
  },



  /**
   * 请求绑定用户信息
   * @params code 登录成功返回的code 
   * @params res 用户信息
   * @params success 成功回调
   */
  bindUserInfo: (code, res, success) => {
    let params = {};
    params.url = wx_login;
    params.data = {
      code: code,
      encryptedData: encodeURIComponent(res.encryptedData),
      iv: encodeURIComponent(res.iv),
    };
    net.req(params, (data) => {//成功后写入本地缓存login_token,
      // console.log(data);
      if (data.token && data.user && data.user.id) {
        wx.setStorageSync('login_userid', data.user.id);
        wx.setStorageSync('login_token', data.token);
      }
      if (success) {
        let user = {
          login_userid: data.user.id,
          login_token: data.token
        }
        success(user);
      }
      return
    });
  },

  /**
   * 弹出授权设置提示框
   */
  showSettingDialog: (e) => {
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userInfo']) {
          wx.showModal({
            title: '提示',
            content: '系统检测到您拒绝授权获取您的信息，要通过授权后才能继续操作，是否前往设置打开授权',
            confirmText: '授权',
            success: (res) => {
              if (res.confirm) {
                wx.openSetting();
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          util.toast(`${e.errMsg}`);
        };
      }
    })
  }
}
module.exports = net;


