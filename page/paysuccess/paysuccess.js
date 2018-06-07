Page({
    data: {/*页面的初始数据*/
        orderCount: 1,
        totalMoney: '',
    },
    onLoad: function (options) {/*生命周期函数--监听页面加载*/
        let orderCount = options.order_count || 1;
        let totalMoney = options.total_money || '';
        this.setData({
            orderCount,
            totalMoney,
        });
    },
    onReady: function () {/*生命周期函数--监听页面初次渲染完成*/ },
    onShow: function () {/*生命周期函数--监听页面显示*/ },
    onHide: function () {/*生命周期函数--监听页面隐藏*/
        // wx.reLaunch({
        //     url: '../index/index',
        // });
    },
    onUnload: function () {/*生命周期函数--监听页面卸载*/
        wx.reLaunch({
            url: '../index/index',
        });
    },
});