const { get_product_by_id } = require('../../util/api.js');
const util = require('../../util/util.js');
const net = require('../../util/net.js');

Page({
    data: {/*页面的初始数据*/
        isloading: true,/*是否加载中...*/
        isMaskShow: false,/*模态窗是否显示，默认不显示*/
        isRuleShow: false,/*七天无理由退货弹出框是否显示，默认不显示*/
        isSkuShow: false,/*sku弹出框是否显示，默认不显示*/
        swiperCurrent: 0,/*swiper当前滑到的图片下标*/
        product: {},/*商品详情对象*/
        attributes: [],/*商品属性对象*/
        priceArr: [],/*商品售价范围*/
        oriPriceArr: [],/*商品原价范围*/
        skuDesc: {/*动态变化的sku描述信息*/
            imgDesc: '',/*sku显示图片*/
            priceDesc: '',/*sku价格或价格范围*/
            stockDesc: '',/*库存数量*/
            selectDesc: '',/*选择提示描述*/
        },
        buyInfoSelect: {/*下单选择的订单信息，包括sku和购买数量等*/
            buyCount: 1,/*购买数量*/
            productId: '',/*商品id，不参与渲染*/
            skuId: '',/*sku id，不参与渲染*/
        },
        selectAttrs: [],/*选择的商品属性id数组，不参与渲染*/
        selectAttrValues: [],/*选择的商品属性值id数组，不参与渲染*/
        unselectArr: [],/*未选择的商品属性，提示用，不参与渲染*/
    },
    onLoad: function (options) {/*生命周期函数--监听页面加载*/
        this.setData({
            buyInfoSelect: {
                ...this.data.buyInfoSelect,
                productId: options.product_id || ''
            }
        });
        this.loadDetail();
    },
    onReady: function () {/*生命周期函数--监听页面初次渲染完成*/ },
    onShow: function () {/*生命周期函数--监听页面显示*/ },
    onHide: function () {/*生命周期函数--监听页面隐藏*/
        this.setData({
            isMaskShow: false,
            isRuleShow: false,
            isSkuShow: false
        });
    },
    onUnload: function () {/*生命周期函数--监听页面卸载*/ },
    onPullDownRefresh: function () {/*页面相关事件处理函数--监听用户下拉动作*/ },
    onReachBottom: function () {/*页面上拉触底事件的处理函数*/ },
    onShareAppMessage: function () {/*用户点击右上角分享*/
        return {
            title: `${this.data.product.name || '商品详情'}`,
            path: `page/product/product?product_id=${this.data.buyInfoSelect.productId}`
        };
    },
    swiperChange: function (e) {/*轮播图片切换监听*/
        this.setData({
            swiperCurrent: e.detail.current
        });
    },
    dotTap: function (e) {/*轮播点的点击事件*/
        this.setData({
            swiperCurrent: e.currentTarget.dataset.which
        });
    },
    maskTap: function (e) {/*模态窗点击*/
        this.setData({
            isMaskShow: false,
            isRuleShow: false,
            isSkuShow: false
        });
    },
    ruleTap: function (e) {/*七天无理由退货点击*/
        this.setData({
            isMaskShow: true,
            isRuleShow: true,
            isSkuShow: false
        });
    },
    knowTap: function (e) {/*七天无理由退货弹出框'知道了'点击*/
        this.setData({
            isMaskShow: false,
            isRuleShow: false,
            isSkuShow: false
        });
    },
    buyNowTap: function (e) {/*立即购买点击*/
        this.setData({
            isMaskShow: true,
            isRuleShow: false,
            isSkuShow: true
        });
    },
    skuCloseTap: function (e) {/*sku关闭点击*/
        this.setData({
            isMaskShow: false,
            isRuleShow: false,
            isSkuShow: false
        });
    },
    countTap: function (e) {/*点击减或加购买数量*/
        let me = this;
        let i = parseInt(e.currentTarget.dataset.i);
        let buyCount = me.data.buyInfoSelect.buyCount + i;
        let stockDesc = me.data.skuDesc.stockDesc || 0;
        if (buyCount <= 0) {
            util.toast(`至少购买1件`, 1000);
            return;
        }
        if (buyCount > stockDesc) {
            util.toast(`最多购买${stockDesc}件`, 1000);
            return;
        }
        me.setData({
            buyInfoSelect: {
                ...me.data.buyInfoSelect,
                buyCount,
            }
        });
    },
    attributeItemTap: function (e) {/*sku商品属性点击*/
        let { attributeId, attributeValueId, attributeImgUrl } = e.currentTarget.dataset;
        let { selectAttrs, selectAttrValues, attributes, product } = this.data;
        if (!attributeImgUrl || 0 === attributeImgUrl.length) {/*没有图片则设置为主图*/
            attributeImgUrl = product.mainImage.url;
        }
        if (-1 !== selectAttrs.indexOf(attributeId)) {/*这个属性已经选择过值*/
            if (-1 !== selectAttrValues.indexOf(attributeValueId)) {/*点击选择的属性值是已经选中的属性值*/
                util.arrayRemove(attributeValueId, selectAttrValues);
                util.arrayRemove(attributeId, selectAttrs);
            } else {/*点击选择的属性值是未选中的属性值*/
                attributes.forEach((val, i, arr) => {
                    if (attributeId === val.id) {/*先找到选择的这种属性*/
                        val.values.forEach((v, j, a) => {
                            if (-1 !== selectAttrValues.indexOf(v.id)) {/*找到之前选中的属性值*/
                                util.arrayRemove(v.id, selectAttrValues);
                            }
                        });
                    }
                });
                selectAttrValues.push(attributeValueId);
            }
        } else {/*这个属性未选择过值*/
            selectAttrValues.push(attributeValueId);
            selectAttrs.push(attributeId);
        }
        this.setData({
            selectAttrs,
            selectAttrValues,
            skuDesc: {
                ...this.data.skuDesc,
                imgDesc: attributeImgUrl
            }
        });
        this.renderSelect();
    },
    skuSureTap: function (e) {/*sku'确定'点击*/
        let { selectAttrs, attributes, unselectArr, buyInfoSelect } = this.data;
        if (selectAttrs.length !== attributes.length) {
            util.toast(`请选择${unselectArr.join(',')}`, 1000);
            return;
        }

        let { productId, skuId, buyCount } = buyInfoSelect;
        skuId = this.getSkuId();

        //获取登录状态
        let user_id = null,
            token = null;
        try {
            user_id = wx.getStorageSync('login_userid');
            token = wx.getStorageSync('login_token');
        } catch (e) {
        }
        if (user_id && token) {
            wx.navigateTo({
                url: `../order/order?product_id=${productId}&sku_id=${skuId}&buy_count=${buyCount}`,
            });
        } else {
            net.login((res) => {
                // console.log(res);
                wx.navigateTo({
                    url: `../order/order?product_id=${productId}&sku_id=${skuId}&buy_count=${buyCount}`,
                });
            });
        }
    },
    renderPriceStock: function () {/*渲染价格范围、可购数量*/
        let { selectAttrValues, attributes, product } = this.data;
        if (!product) {
            return;
        }
        let { skuInfo } = product;
        if (!skuInfo || !Array.isArray(skuInfo) || 0 === skuInfo.length) {
            this.setData({
                skuDesc: {
                    ...this.data.skuDesc,
                    priceDesc: product.formatPrice,
                    stockDesc: product.stockCount,
                }
            });
            return;
        }
        let j, n = selectAttrValues.length;
        let priceArr = [], priceDesc = '', stockArr = [], stockDesc = 0, buyCount = this.data.buyInfoSelect.buyCount;
        skuInfo.forEach((val, i, arr) => {
            let flag = true;
            if (selectAttrValues.length === attributes.length) {
                for (let j = 0; j < n; j++) {
                    if (-1 === val.attributeIds.indexOf(selectAttrValues[j])) {
                        flag = false;
                        break;
                    }
                }
            }
            if (flag) {
                priceArr.push(parseFloat(val.price).toFixed(2));
            }
            flag = true;
            for (let j = 0; j < n; j++) {
                if (-1 === val.attributeIds.indexOf(selectAttrValues[j])) {
                    flag = false;
                    break;
                }
            }
            // if ((0 !== parseInt(val.stockCount)) && flag) {
            //     priceArr.push(parseFloat(val.price).toFixed(2));
            //     stockArr.push(parseInt(val.stockCount));
            // }
            if (flag) {
                stockArr.push(parseInt(val.stockCount));
            }
        });
        priceArr.sort((a, b) => {
            return a - b;
        });
        let len = priceArr.length;
        if (1 === len) {
            priceDesc = util.money(priceArr[0], 2, 1);
        } else if (len >= 2) {
            let priceMin = priceArr[0];
            let priceMax = priceArr[len - 1];
            if (priceMin === priceMax) {
                priceDesc = util.money(priceMin, 2, 1);
            } else {
                priceDesc = util.money(priceMin, 2, 1) + ' - ' + util.money(priceMax, 2, 1);
            }
        }

        stockArr.forEach((val, i, arr) => {
            stockDesc += val;
        });
        if (buyCount > stockDesc) {
            buyCount = stockDesc;
        }

        this.setData({
            skuDesc: {
                ...this.data.skuDesc,
                priceDesc,
                stockDesc,
            },
            buyInfoSelect: {
                ...this.data.buyInfoSelect,
                buyCount,
            }
        });
    },
    renderSelect: function (isFirst) {/*渲染属性*/
        let { selectAttrs, selectAttrValues, attributes, product } = this.data;
        if (!product) {
            return;
        }

        let selectArr = [], unselectArr = [], selectDesc = '';
        attributes.forEach((val, i, arr) => {
            if (-1 !== selectAttrs.indexOf(val.id)) {
                val.values.forEach((v, j, a) => {
                    if (-1 !== selectAttrValues.indexOf(v.id)) {
                        selectArr.push(v.value);
                    }
                });
            } else {
                unselectArr.push(val.name);
            }
        });
        if (0 === unselectArr.length) {/*属性已全部选择*/
            selectDesc = '已选择：' + selectArr.join(' ');
        } else {
            selectDesc = '请选择：' + unselectArr.join(' ');
        }

        this.setData({
            skuDesc: {
                ...this.data.skuDesc,
                selectDesc,
            },
            unselectArr,/*仅赋值，不参与渲染*/
        });
        this.checkAttributeEnable(isFirst);
        this.renderPriceStock();
    },
    checkAttributeEnable: function (isFirst) {/*检测商品属性是否可点击选择*/
        let { product, attributes, selectAttrs, selectAttrValues } = this.data;
        let { skuInfo } = product;

        let nArr = [], yArr = [], disableArr = [];
        skuInfo.forEach((val, i, arr) => {
            // val.attributeIds.forEach((v, j, a) => {
            //     if (-1 !== selectAttrValues.indexOf(v)) {
            //         if (0 === val.stockCount) {
            //             nArr = nArr.concat(val.attributeIds);
            //         } else {
            //             yArr = yArr.concat(val.attributeIds);
            //         }
            //     }
            // });
            if (1 === attributes.length) {
                if (0 === val.stockCount) {
                    nArr = nArr.concat(val.attributeIds);
                } else {
                    yArr = yArr.concat(val.attributeIds);
                }
            } else {
                selectAttrValues.forEach((v, j, a) => {
                    if (-1 !== val.attributeIds.indexOf(v)) {
                        if (0 === val.stockCount) {
                            nArr = nArr.concat(val.attributeIds);
                        } else {
                            yArr = yArr.concat(val.attributeIds);
                        }
                    }
                });
            }
        });
        nArr = Array.from(new Set(nArr.sort((a, b) => {
            return a - b;
        })));
        yArr = Array.from(new Set(yArr.sort((a, b) => {
            return a - b;
        })));
        disableArr = nArr.filter((val, i, arr) => {
            return -1 === yArr.indexOf(val);
        });
        attributes.forEach((val, i, arr) => {
            let ableCount = 0, k = 0;
            if (-1 !== selectAttrs.indexOf(val.id)) {
                val.values.forEach((v, j, a) => {
                    if (-1 !== selectAttrValues.indexOf(v.id)) {
                        attributes[i].values[j].class = 'active';
                    } else {
                        if (-1 !== disableArr.indexOf(v.id)) {
                            attributes[i].values[j].class = 'disable';
                        } else {
                            attributes[i].values[j].class = '';
                            ableCount++;
                            k = j;
                        }
                    }
                });
            } else {
                val.values.forEach((v, j, a) => {
                    if (-1 !== disableArr.indexOf(v.id)) {
                        attributes[i].values[j].class = 'disable';
                    } else {
                        attributes[i].values[j].class = '';
                        ableCount++;
                        k = j;
                    }
                });
            }
            if (isFirst && 1 === ableCount) {/*第一次渲染只有一个属性值的时候自动选上*/
                selectAttrValues.push(val.values[k].id);
                selectAttrs.push(val.id);
                attributes[i].values[k].class = 'active';
                let attributeImgUrl = val.values[k].imgUrl;
                if (!attributeImgUrl || 0 === attributeImgUrl.length) {/*没有图片则设置为主图*/
                    attributeImgUrl = product.mainImage.url;
                }
                this.setData({
                    skuDesc: {
                        ...this.data.skuDesc,
                        imgDesc: attributeImgUrl
                    }
                });
            }
        });
        this.setData({
            attributes,
            selectAttrs,
            selectAttrValues,
        });
    },
    getSkuId: function () {
        let { selectAttrValues, product, attributes } = this.data;
        let { skuInfo } = product;
        let j, n = selectAttrValues.length, skuId = '';
        skuInfo.every((val, i, arr) => {
            let flag = true, k = 0;
            for (j = 0; j < n; j++) {
                if (-1 !== val.attributeIds.indexOf(selectAttrValues[j])) {
                    k++;
                }
            }
            if (k === attributes.length) {
                skuId = val.id;
                return false;/*break*/
            }
            return true;
        });
        return skuId;
    },
    loadDetail: function () {/*请求商品详情数据*/
        let me = this;
        let params = {};
        params.url = get_product_by_id;
        params.data = {
            product_id: me.data.buyInfoSelect.productId,
        };
        net.req(params, function (data) {
            me.adapter(data);
        });
    },
    adapter: function (data) {/*显示数据*/
        let product = data.product || {
            mainImage: {},
            skuInfo: [],
            attributes: []
        };
        let { mainImage, skuInfo, attributes } = product;
        if (!attributes) {
            attributes = [];
        }
        this.setData({
            product,
            attributes,
            skuDesc: {
                ...this.data.skuDesc,
                imgDesc: mainImage.url
            },
            isloading: false,
        });
        this.getShowPriceArr();
        this.renderSelect(true);
    },
    getShowPriceArr: function () {/*获取价格范围*/
        let { product } = this.data;
        if (!product) {
            return;
        }
        let { skuInfo } = product;
        let priceArr = [], oriPriceArr = [];
        if (skuInfo && Array.isArray(skuInfo) && 0 !== skuInfo.length) {
            skuInfo.forEach((val, i, arr) => {
                // if (0 !== parseInt(val.stockCount)) {
                //     priceArr.push(val.price);
                //     oriPriceArr.push(val.oriPrice);
                // }
                priceArr.push(val.price);
                oriPriceArr.push(val.oriPrice);
            });
            priceArr = Array.from(new Set(priceArr.sort((a, b) => {
                return a - b;
            })));
            oriPriceArr = Array.from(new Set(oriPriceArr.sort((a, b) => {
                return a - b;
            })));
            let len = priceArr.length;
            if (0 === len) {
                priceArr = [product.price];
            } else if (1 === priceArr.length) {
                if (0 === parseFloat(priceArr[0])) {
                    priceArr = [product.price];
                }
            } else {
                priceArr = [priceArr[0], priceArr[len - 1]];
            }
            len = oriPriceArr.length;
            if (0 === len) {
                oriPriceArr = [product.oriPrice];
            } else if (1 === oriPriceArr.length) {
                if (0 === parseFloat(oriPriceArr[0])) {
                    oriPriceArr = [product.oriPrice];
                }
            } else {
                oriPriceArr = [oriPriceArr[0], oriPriceArr[len - 1]];
            }
        } else {
            priceArr.push(product.price);
            oriPriceArr.push(product.oriPrice);
        }
        this.setData({
            priceArr,
            oriPriceArr
        });
    },
    preventTouchMove: function () {/*防止滑动穿透*/

    },
});