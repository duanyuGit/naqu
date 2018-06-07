/**
 * 项目中所用到的全部常量
 */
const CODE_NOT_LOGIN = 88888;//接口返回未登录errorCode
const CODE_NEED_AUTH_UNIONID = 600;//调wx_login登录接口时若返回600，则表示code没有取到unionid，要求用户授权才能获取unionid
const DEBUG = true;//全局是否开启console.log()调试
const PULL_DOWN = 1;//下拉刷新数据
const PULL_NONE = 2;//无上拉或下拉,正常请求数据
const PULL_UP = 3;//上拉加载数据

module.exports = {
    CODE_NOT_LOGIN,
    CODE_NEED_AUTH_UNIONID,
    DEBUG,
    PULL_DOWN,
    PULL_NONE,
    PULL_UP
}
