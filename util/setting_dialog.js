
/**
 * 授权类型
 */
const SCOPE_TYPE = {
  //选择通讯地址
  ADDRESS: "scope.address",
  //用户信息
  USER_INFO: "scope.userInfo",
  //获取地理位置
  GET_LOCATION: "scope.userLocation",
  //选择地理位置
  CHOOSE_LOCATION: "scope.userLocation",
}

const setting_dialog = {

  /**
   * 如果未授权，显示去设置对话框,否则回调callback方法
   * @scope_type 授权类型SCOPE_TYPE
   * @tip_content 提示内容
   * @callback 如果已经授权，回调该方法
   */
  showSettingDialog: (scope_type, tip_content, callback) => {
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting[scope_type]) {
          wx.showModal({
            title: '提示',
            content: tip_content,
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
          callback();
        };
      }
    })
  },

  /**
   * 选择通讯地址，如果未授权，显示去设置对话框
   * @callback 如果已经授权，回调该方法
   */
  chooseAddress: (callback) => {
    setting_dialog.showSettingDialog(SCOPE_TYPE.ADDRESS, "系统检测到您拒绝授权获取您的通讯地址信息，要通过授权后才能继续操作，是否前往设置打开授权", callback);
  },

  /**
  * 获取用户信息，如果未授权，显示去设置对话框
  * @callback 如果已经授权，回调该方法
  */
  getUserInfo: (callback) => {
    setting_dialog.showSettingDialog(SCOPE_TYPE.USER_INFO, "系统检测到您拒绝授权获取您的用户信息，要通过授权后才能继续操作，是否前往设置打开授权", callback);
  },

  /**
   * 获取地理位置，如果未授权，显示去设置对话框
   * @callback 如果已经授权，回调该方法
   */
  getLocation: (callback) => {
    setting_dialog.showSettingDialog(SCOPE_TYPE.GET_LOCATION, "系统检测到您拒绝授权获取您的地理位置信息，要通过授权后才能继续操作，是否前往设置打开授权", callback);
  },

  /**
   * 选择地理位置，如果未授权，显示去设置对话框
   * @callback 如果已经授权，回调该方法
   */
  chooseLocation: (callback) => {
    setting_dialog.showSettingDialog(SCOPE_TYPE.CHOOSE_LOCATION, "系统检测到您拒绝授权获取您的地理位置信息，要通过授权后才能继续操作，是否前往设置打开授权", callback);
  },


};
module.exports = setting_dialog;