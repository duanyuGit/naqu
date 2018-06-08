/**
 * 接口地址url
 */
const cfg = require('../config.js');
const api = cfg.api();
const apis = {
    get_mini_goods_list: `${api}/c2c/get_mini_goods_list`,
    wx_login: `${api}/c2c/wx_login`,
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
    upload_photo: `${api}/c2c/upload_photo`,
}
module.exports = apis;