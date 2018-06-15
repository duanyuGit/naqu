/**
 * 接口地址url
 */
const cfg = require('../config.js');
const api = cfg.api();
const apis = {
    get_mini_goods_list: `${api}/c2c/get_mini_goods_list`,
    wx_login: `${api}/c2c/wechat-mini`,//登录授权
    publish_homestead: `${api}/c2c/set-community`,//创建家园
    get_communities: `${api}/c2c/get-communities`,//家园列表
    get_homestead: `${api}/c2c/community-articles`,//首页
    upload: `${api}/c2c/article`,//发布
    get_user: `${api}/c2c/user`,//我的
    with_draw: `${api}/c2c/user-token-draw`,//提取
    bind_coin_address: `${api}/c2c/user-complete-info`,//绑定地址
    get_detail: `${api}/c2c/get-article`,//详情
    get_product_by_id: `${api}/c2c/get_product_by_id`,
    buy_product: `${api}/c2c/buy_product`,
    confirm_order: `${api}/c2c/confirm_order`,
    update_confirm_order: `${api}/c2c/update_confirm_order`,
    get_address_list: `${api}/c2c/get_address_list`,
    update_address: `${api}/c2c/update_address`,
    add_address: `${api}/c2c/add_address`,
    get_province_for_address: `${api}/c2c/get_province_for_address`,
    get_city_for_address: `${api}/c2c/get_city_for_address`,
    get_district_for_address: `${api}/c2c/get_district_for_address`,
    pay_order: `${api}/c2c/pay_order`,
    send_pay_mini_msg: `${api}/c2c/send_pay_mini_msg`,
    upload_photo: `${api}/c2c/upload`,
}
module.exports = apis;