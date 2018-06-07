const { buy_product, confirm_order, pay_order, send_pay_mini_msg } = require('../../util/api.js');
const net = require('../../util/net.js');
const util = require('../../util/util.js');
Page({
    data: {/*页面的初始数据*/
        hasAddress: false,/*用户是否有默认地址*/
        orders: [],/*结果中完整的orders，用来传递*/
        address: null,
        product: {},
        isloading: true
    },
    pageData: {
        ispaying: false,
        payOrders: null
    },
    onLoad: function (options) {/*生命周期函数--监听页面加载*/
        let obj = {
            product_id: options.product_id,
            spec_id: options.sku_id,
            count: options.buy_count
        }
        this.loadData(obj);
    },
    onReady: function () {/*生命周期函数--监听页面初次渲染完成*/ },
    onShow: function () {/*生命周期函数--监听页面显示*/ },
    onHide: function () {/*生命周期函数--监听页面隐藏*/ },
    onUnload: function () {/*生命周期函数--监听页面卸载*/ },
    payTap: function (e) {/*'微信支付'点击*/
        if (!this.data.address) {
            util.toast(`请选择收货地址`);
            return;
        }
        //console.log(params);
        if (this.pageData.ispaying == true) return;
        this.pageData.ispaying = true;
        if (this.pageData.payOrders != null) {
            //console.log(this.pageData.payOrders);
            let p = {};
            p.url = pay_order;
            p.data = {
                orders: JSON.stringify(this.pageData.payOrders),
                platform: 'wechat_mini_pay'
            }
            net.reqPromise(p).then((data) => {
                let { weixinInfo } = data;
                // console.log(weixinInfo);
                // return;
                //调取微信支付
                this.wxPay(weixinInfo, this.pageData.payOrders);
            });
        } else {
            //获取要提交的orders
            let orders = null,
                ordersObj = null;
            try {
                orders = wx.getStorageSync('orders');
                //处理orders
                ordersObj = JSON.parse(orders);
                //console.log(ordersObj);return;
            } catch (e) {
            }
            let params = {};
            params.url = confirm_order;
            params.data = {
                orders: JSON.stringify([{
                    coupon: null,
                    address: this.data.address,
                    id: ordersObj[0].id,
                    supportCheckService: false,
                    shoppingcart_items: ordersObj[0].shoppingCartItems,
                    sumbitMessage: {
                        "id": "",
                        "content": "",
                        "sellerID": ordersObj[0].seller.id,
                        "dictionaryKey": "YMBuyerMessage"
                    }
                }]),
                s_support_check_service: 0
            };
            net.reqPromise(params, true).then((data) => {
                //console.log(data);
                // if (data.payment) {
                //     wx.setStorageSync('payOrders', JSON.stringify(data.payment.orders))
                // }
                this.pageData.payOrders = data.payment.orders;
                let p = {};
                p.url = pay_order;
                p.data = {
                    orders: JSON.stringify(data.payment.orders),
                    platform: 'wechat_mini_pay',
                    // openid:'o450g0QmuMWTrUg_sInfzxM-vpnM'
                }
                return net.reqPromise(p);
            }, (res) => {
                this.pageData.ispaying = false;
                if (100 === res.errorCode) {
                    util.toast(res.serverMsg);
                } else {
                    util.toast('提交订单失败');
                }
            }).then((res) => {
                // console.log(res);        
                if (!res) return;
                let { weixinInfo } = res;
                // console.log(weixinInfo);
                // return;
                //调取微信支付
                this.wxPay(weixinInfo, this.pageData.payOrders);
            });
        }
    },
    wxPay: function (weixinInfo, ordersObj) {
        let order_id = ordersObj[0].id;
        wx.requestPayment({
            'timeStamp': weixinInfo.timeStamp,
            'nonceStr': weixinInfo.nonceStr,
            'package': weixinInfo.packageValue,
            'signType': 'MD5',
            'paySign': weixinInfo.sign,
            'success': (res) => {
                // console.log(res);
                this.pageData.ispaying = false;
                try {
                    wx.removeStorageSync('orders');//支付成功清空orders缓存
                    this.notify_pay_success(order_id, weixinInfo.prepayId, `page/paysuccess/paysuccess?total_money=${ordersObj[0].paySum}`);
                } catch (e) { }
                wx.redirectTo({
                    url: `../paysuccess/paysuccess?total_money=${ordersObj[0].paySum}`,
                });
            },
            'fail': (res) => {
                this.pageData.ispaying = false;
                console.log(res);
            }
        });
    },
    notify_pay_success: function (order_id, prepare_id, page) {/*支付成功后通知服务器发推送消息*/
        let params = {};
        params.url = send_pay_mini_msg;
        params.data = {
            order_id,
            prepare_id,
            page,
        };
        net.req(params, (data) => {
            console.log(data);
        }, (e) => {
            console.log(e);
        });
    },
    addressCallback: function (obj) {/*address:list页面选完地址回调 或 addedit页面新增地址后回调*/
        this.adapter(obj);
    },
    loadData: function (obj) {/*加载页面数据*/
        let me = this;
        let params = {};
        params.url = buy_product;
        params.method = 'POST';
        params.data = obj;
        net.req(params, (data) => {
            //console.log(data);
            this.adapter(data);
        });
    },
    adapter: function (obj) {/*显示页面数据*/
        let ordersStr = JSON.stringify(obj.orders);
        //console.log(ordersStr);
        wx.setStorageSync('orders', ordersStr);
        //没有购物车商品数和价格就是总数和总价
        if (obj.address && obj.address.address) {//确定是否有地址
            this.setData({ address: obj.address, hasAddress: true });
        }
        this.setData({ product: obj.orders[0], isloading: false });//订单中只有一件商品，orders中的第0项为商品信息
    },
});