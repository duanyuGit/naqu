const { update_address, add_address, update_confirm_order, get_province_for_address, get_city_for_address, get_district_for_address } = require('../../../util/api.js');
const util = require('../../../util/util.js');
const net = require('../../../util/net.js');

Page({
    data: {/*页面的初始数据*/
        addrInfo: {/*新增或编辑地址信息*/
            name: '',/*收件人*/
            phone_number: '',/*手机号*/
            area: '',/*所在地区*/
            address_id: '',
            address: '',/*详细地址*/
            postcode: '',/*邮编*/
            default1: 0,/*是否设为默认地址*/
            province_id: '',/*省id*/
            district_id: '',
            city_id: ''
        },
        formatPhone: true,
        isMaskShow: false,/*遮罩是否显示*/
        isAreaLayoutShow: false,/*地址弹框是否显示*/
        areaTitle: '选择省/直辖市',/*地区弹框显示标题*/
        showType: 'province',/*显示取值：province,city,district*/
        provinceArr: [],/*省/直辖市数据*/
        cityArr: [],/*城市数据*/
        districtArr: [],/*区域数据*/
    },
    pageData: {
        source: 'list',//来源order或list
        type: 'add',//类型add或edit,
        addrObj: {
            "address": "",
            "city": {
                "displayName": "北京市",
                "latitude": 0,
                "level": 0,
                "longitude": 0,
                "name": "北京市",
                "parentId": "110100",
                "parentName": "北京",
                "id": "110000"
            },
            "csAddressFlag": false,
            "displaySectedFlag": false,
            "district": {
                "displayName": "朝阳区",
                "latitude": 0,
                "level": 0,
                "longitude": 0,
                "name": "朝阳区",
                "parentId": "110000",
                "parentName": "北京市",
                "id": "110105"
            },
            "isDefault": true,
            "name": "",
            "phoneNumber": "",
            "postcode": "100000",
            "province": {
                "displayName": "北京市",
                "latitude": 0,
                "level": 0,
                "longitude": 0,
                "name": "北京市",
                "parentId": "-1",
                "parentName": "中华人民共和国",
                "id": "110100"
            },
            "id": "453020"
        },
        selectAddr: {/*选择的省、城市、区域*/
            provinceId: '',
            provinceName: '',
            provinceParentId: '',
            provinceParentName: '',
            cityId: '',
            cityName: '',
            cityParentId: '',
            cityParentName: '',
            districtId: '',
            districtName: '',
            districtParentId: '',
            districtParentName: '',
        },
    },
    hideAreaHandle: function (e) {/*隐藏选择地区*/
        this.setData({
            isMaskShow: false,
            isAreaLayoutShow: false,
        });
    },
    selectAreaTap: function (e) {/*所在地区点击*/
        this.setData({
            areaTitle: '选择省/直辖市',
            showType: 'province',
            isMaskShow: true,
            isAreaLayoutShow: true,
        });
    },
    onLoad: function (options) {/*生命周期函数--监听页面加载*/
        this.pageData.source = options.source ? options.source : this.pageData.source;
        this.pageData.type = options.type ? options.type : this.pageData.type;
        if (this.pageData.type == 'edit') {
            wx.setNavigationBarTitle({ title: '编辑地址' });
            let addrEdit = wx.getStorageSync('addrEdit');//获取地址对象
            let addrInfo = {
                address: addrEdit.address,
                postcode: addrEdit.postcode,
                address_id: addrEdit.id,
                province_id: addrEdit.province.id,
                default1: addrEdit.isDefault,
                name: addrEdit.name,
                phone_number: addrEdit.phoneNumber,
                district_id: addrEdit.district ? addrEdit.district.id : '',
                city_id: addrEdit.city ? addrEdit.city.id : '',
                area: addrEdit.province.name + (addrEdit.city ? ' ' + addrEdit.city.name : '') + (addrEdit.district ? ' ' + addrEdit.district.name : '')
            }
            this.setData({ addrInfo: addrInfo });//addrInfo为最终提交数据
        } else {
            wx.setNavigationBarTitle({ title: '新增地址' });
        }
        this.loadProvince();
    },
    onReady: function () {/*生命周期函数--监听页面初次渲染完成*/ },
    onShow: function () {/*生命周期函数--监听页面显示*/ },
    onHide: function () {/*生命周期函数--监听页面隐藏*/ },
    onUnload: function () {/*生命周期函数--监听页面卸载*/ },
    areaCallback: function (selectAddr) {/*选择所在地区回调*/
        selectAddr = util.deepClone(selectAddr);
        this.setData({
            addrInfo: {
                ...this.data.addrInfo,
                area: selectAddr.area,
                district_id: selectAddr.districtId,
                city_id: selectAddr.cityId,
                province_id: selectAddr.provinceId
            }
        });
        //写更新订单所需对象
        if (this.pageData.source == 'order') {
            //省
            this.pageData.addrObj.province.id = selectAddr.provinceId;
            this.pageData.addrObj.province.displayName = selectAddr.provinceName;
            this.pageData.addrObj.province.name = selectAddr.provinceName;
            this.pageData.addrObj.province.parentName = selectAddr.provinceParentName;
            this.pageData.addrObj.province.parentId = selectAddr.provinceParentId;
            //市
            this.pageData.addrObj.city.id = selectAddr.cityId;
            this.pageData.addrObj.city.displayName = selectAddr.cityName;
            this.pageData.addrObj.city.name = selectAddr.cityName;
            this.pageData.addrObj.city.parentName = selectAddr.cityParentName;
            this.pageData.addrObj.city.parentId = selectAddr.cityParentId;
            //区
            this.pageData.addrObj.district.id = selectAddr.districtId;
            this.pageData.addrObj.district.displayName = selectAddr.districtName;
            this.pageData.addrObj.district.name = selectAddr.districtName;
            this.pageData.addrObj.district.parentName = selectAddr.districtParentName;
            this.pageData.addrObj.district.parentId = selectAddr.districtParentId;
        }
    },
    nameChange(e) {
        this.setData({
            addrInfo: {
                ...this.data.addrInfo,
                name: e.detail.value
            }
        })
    },
    phoneNumberChange(e) {
        let phone_number = e.detail.value.indexOf("*") > -1 ? '' : e.detail.value;
        this.setData({
            addrInfo: {
                ...this.data.addrInfo,
                phone_number: phone_number
            },
            formatPhone: false
        })
    },
    addressChange(e) {
        this.setData({
            addrInfo: {
                ...this.data.addrInfo,
                address: e.detail.value
            }
        })
    },
    postcodeChange(e) {
        this.setData({
            addrInfo: {
                ...this.data.addrInfo,
                postcode: e.detail.value
            }
        })
    },
    siwtchDefault() {
        this.setData({
            addrInfo: {
                ...this.data.addrInfo,
                default1: !this.data.addrInfo.default1 ? 1 : 0
            }
        })
    },
    checkform: function () {
        //验姓名
        if (!this.data.addrInfo.name) {
            util.toast(`请填写收件人姓名`);
            return false;
        }
        //验手机号
        if (!this.data.addrInfo.phone_number) {
            util.toast(`请填写手机号码`);
            return false;
        }
        if (!/1\d{10}/.test(this.data.addrInfo.phone_number)) {
            util.toast(`手机号格式错误`);
            return false;
        }
        //验省份
        if (!this.data.addrInfo.province_id) {
            util.toast(`请选择省份地址`);
            return false;
        }
        //验证详细地址
        if (!this.data.addrInfo.address) {
            util.toast(`请填写详细地址`);
            return false;
        }
        return true;
    },
    saveAddrHandle: function () {
        if (!this.checkform()) return;
        let params = {};
        params.url = this.pageData.type == 'edit' ? update_address : add_address;
        params.data = this.data.addrInfo;
        params.data.command = this.pageData.type == 'edit' ? 'update_address' : 'add_address';
        wx.showLoading({
            title: '保存中...',
            mask: true
        })
        net.reqPromise(params).then((data) => {
            if (this.pageData.source == 'order') {
                //写更新订单所需对象
                let addrObj = {
                    ...this.pageData.addrObj,
                    address: this.data.addrInfo.address,
                    name: this.data.addrInfo.name,
                    phoneNumber: this.data.addrInfo.phone_number,
                    postcode: this.data.addrInfo.postcode,
                    id: data.id
                }
                let p = {};
                p.url = update_confirm_order;
                p.data = {
                    orders: wx.getStorageSync('orders'),
                    address: JSON.stringify(addrObj)
                };
                return net.reqPromise(p);
            }
            wx.hideLoading();
            let pages = getCurrentPages();/*在内存中的所有页面栈对象*/
            let lastPage = pages[pages.length - 2];/*上一个页面可能是list或order*/
            if (lastPage && lastPage.addressCallback) {
                //if (this.pageData.source=='list')
                lastPage.addressCallback();
                wx.navigateBack();
            }
        }).then((data) => {
            wx.hideLoading();
            if (data && this.pageData.source == 'order') {
                let pages = getCurrentPages();/*在内存中的所有页面栈对象*/
                let orderPage = pages[pages.length - 2];/*订单页面对象*/
                if (orderPage && orderPage.addressCallback) {
                    orderPage.addressCallback(data);
                    wx.navigateBack();
                }
            }
        });
    },

    provinceTap: function (e) {/*省点击事件*/
        let { provinceId, provinceName, provinceParentId, provinceParentName } = e.currentTarget.dataset;
        this.pageData.selectAddr = {
            ...this.pageData.selectAddr,
            provinceId,
            provinceName,
            provinceParentId,
            provinceParentName,
        };
        this.setData({
            areaTitle: provinceName,
            showType: 'city',
            cityArr: [],
        });
        this.loadCity(provinceId);
    },
    cityTap: function (e) {/*城市点击事件*/
        let { cityId, cityName, cityParentId, cityParentName } = e.currentTarget.dataset;
        this.pageData.selectAddr = {
            ...this.pageData.selectAddr,
            cityId,
            cityName,
            cityParentId,
            cityParentName,
        };
        this.setData({
            areaTitle: cityName,
            showType: 'district',
            districtArr: [],
        });
        this.loadDistrict(cityId);
    },
    districtTap: function (e) {/*区域点击事件*/
        let { districtId, districtName, districtParentId, districtParentName } = e.currentTarget.dataset;
        this.pageData.selectAddr = {
            ...this.pageData.selectAddr,
            districtId,
            districtName,
            districtParentId,
            districtParentName,
        };
        this.backBefore();
    },
    backBefore: function () {/*选择地址完成返回上一个页面*/
        let sa = this.pageData.selectAddr;
        let area = sa.provinceName + ' ' + sa.cityName + ' ' + sa.districtName;
        this.pageData.selectAddr.area = area;
        this.hideAreaHandle();
        this.areaCallback(sa);
    },
    loadProvince: function () {/*加载省/直辖市数据*/
        let me = this;
        let params = {};
        params.url = get_province_for_address;
        params.data = {
            command: 'get_province_for_address',
        };
        net.req(params, function (data) {
            me.adapterProvince(data.areaList);
        });
    },
    adapterProvince: function (arr) {/*显示省/直辖市*/
        if (!arr || !Array.isArray(arr) || 0 === arr.length) {
            console.log('暂无省/直辖市');
            return;
        }
        this.setData({
            provinceArr: arr
        });
    },
    loadCity: function (province_id) {/*加载城市数据*/
        let me = this;
        let params = {};
        params.url = get_city_for_address;
        params.data = {
            command: 'get_city_for_address',
            province_id,
        };
        net.req(params, function (data) {
            me.adapterCity(data.areaList);
        });
    },
    adapterCity: function (arr) {/*显示城市*/
        if (!arr || !Array.isArray(arr) || 0 === arr.length) {
            console.log('暂无城市');
            this.pageData.selectAddr = {
                ...this.pageData.selectAddr,
                cityId: '',
                cityName: '',
                cityParentId: '',
                cityParentName: '',
                districtId: '',
                districtName: '',
                districtParentId: '',
                districtParentName: '',
            };
            this.backBefore();/*有些直辖市可能没有城市，直接返回*/
            return;
        }
        this.setData({
            cityArr: arr
        });
    },
    loadDistrict: function (city_id) {/*加载区域数据*/
        let me = this;
        let params = {};
        params.url = get_district_for_address;
        params.data = {
            command: 'get_district_for_address',
            city_id,
        };
        net.req(params, function (data) {
            me.adapterDistrict(data.areaList);
        });
    },
    adapterDistrict: function (arr) {/*显示区域*/
        if (!arr || !Array.isArray(arr) || 0 === arr.length) {
            console.log('暂无区域');
            this.pageData.selectAddr = {
                ...this.pageData.selectAddr,
                districtId: '',
                districtName: '',
                districtParentId: '',
                districtParentName: '',
            };
            this.backBefore();/*有些城市可能没有区域，直接返回*/
            return;
        }
        this.setData({
            districtArr: arr
        });
    },
});