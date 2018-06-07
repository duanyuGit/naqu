const { get_address_list, update_confirm_order } = require('../../../util/api.js');
const net = require('../../../util/net.js');
Page({
    data: {/*页面的初始数据*/
        selectAddrId: '',/*从上个页面传过来的被选中的地址id*/
        addressList: [],/*地址列表数据*/
        isloading: true
    },
    onLoad: function (options) {/*生命周期函数--监听页面加载*/
        this.setData({ selectAddrId: options.addrId });
        this.loadAddressList();
    },
    onReady: function () {/*生命周期函数--监听页面初次渲染完成*/ },
    onShow: function () {/*生命周期函数--监听页面显示*/ },
    onHide: function () {/*生命周期函数--监听页面隐藏*/ },
    onUnload: function () {/*生命周期函数--监听页面卸载*/ },
    selectTap: function (e) {/*选择地址点击*/
        //console.log(e.currentTarget.dataset);
        let params = {};
        params.url = update_confirm_order;
        params.data = {
            command: 'update_confirm_order',
            orders: wx.getStorageSync('orders'),
            address: JSON.stringify(e.currentTarget.dataset.addressItem)
        };
        wx.showLoading({
            title: '选择中...',
            mask: true
        })
        net.req(params, (data) => {
            wx.hideLoading();
            let pages = getCurrentPages();/*在内存中的所有页面栈对象*/
            let orderPage = pages[pages.length - 2];/*订单页面对象*/
            if (orderPage && orderPage.addressCallback) {
                orderPage.addressCallback(data);
                wx.navigateBack();
            }
        });
    },
    addressCallback: function () {
        this.loadAddressList();
    },
    editTap: function (e) {/*编辑点击*/
        let { addressItem } = e.currentTarget.dataset;
        wx.setStorageSync('addrEdit', addressItem);//存储需要编辑的地址对象
        wx.navigateTo({
            url: `../addedit/addedit?type=edit`,
        });
    },
    loadAddressList: function () {/*加载地址列表信息*/
        let params = {};
        params.url = get_address_list;
        params.data = {
            command: 'get_address_list',
        };
        net.req(params, (data) => {
            this.adapterAddressList(data.addressList);
        });
    },
    adapterAddressList: function (arr) {/*显示地址列表*/
        this.setData({
            isloading: false
        });
        if (!arr || !Array.isArray(arr) || 0 === arr.length) {
            console.log('地址列表为空');
            return;
        }
        this.setData({
            addressList: arr
        });
    },
});