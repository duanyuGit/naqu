const util = {
    deepClone: (obj) => {/*深度克隆对象*/
        if (null === obj || 'object' !== typeof obj) {
            return obj;
        }
        let clone;
        if (obj instanceof Date) {
            clone = new Date();
            clone.setTime(obj.getTime());
            return clone;
        }
        if (obj instanceof Array) {
            clone = [];
            let i, n = obj.length;
            for (i = 0; i < n; i++) {
                clone[i] = util.deepClone(obj[i]);
            }
        }
        if (obj instanceof Object) {
            clone = {};
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    clone[key] = util.deepClone(obj[key]);
                }
            }
            return clone;
        }
        throw new Error(`Unable to clone obj! Its type isn't supported.`);
    },
    toast: (s, t, cb) => {
        if (!s) return;
        let pages = getCurrentPages();
        let curPage = pages[pages.length - 1];
        curPage.setData({
            isToastShow: true,
            toastContent: s,
        });
        setTimeout(() => {
            curPage.setData({
                isToastShow: false,
                toastContent: '',
            });
            if (cb) {
                cb();
            }
        }, t || 2000);
    },
    arrayRemove: (val, arr) => {/*删除数组内某个元素*/
        if (!arr || !Array.isArray(arr)) {
            return;
        }
        arr.forEach((v, i, a) => {
            if (val === v) {
                a.splice(i, 1);
            }
        });
    },
    cstr: function (s) {/*处理null、undefined或NaN字符串*/
        if (s) {
            return s.toString();
        } else {
            return '';
        }
    },
    money: function (m, c, w) { /*m:金额;c:保留小数位数,只能取值0,1,2;w:1返回整个金额,2返回整数部分,3返回小数部分*/
        if (c !== 0 && c !== 1 && c !== 2) {
            console.log('传入保留小数位数参数错误');
            return '';
        }
        if (w !== 1 && w !== 2 && w !== 3) {
            console.log('传入返回类型参数错误');
            return '';
        }

        if (0 === m) { /*由于0=false,需特殊处理*/
            return deal('0', '');
        } else {
            if (!m || isNaN(m)) {
                return '';
            }
            m = m.toString();
            if (-1 === m.indexOf('.')) {
                return deal(m, '');
            } else {
                var s_arr = m.split('.');
                return deal(s_arr[0], s_arr[1]);
            }
        }

        function deal(p, f) { /*p为整数部分*/
            if (0 === c) {
                if (1 === w) {
                    return p;
                } else if (2 === w) {
                    return p;
                } else if (3 === w) {
                    return '';
                }
            } else if (1 === c) {
                if (0 === f.length) {
                    f = '0';
                } else if (f.length >= 2) {
                    f = f.substring(0, 1);
                }
                if (1 === w) {
                    return p + '.' + f;
                } else if (2 === w) {
                    return p;
                } else if (3 === w) {
                    return f;
                }
            } else if (2 === c) {
                if (0 === f.length) {
                    f = '00';
                } else if (1 === f.length) {
                    f = f + '0';
                } else if (f.length >= 3) {
                    f = f.substring(0, 2);
                }
                if (1 === w) {
                    return p + '.' + f;
                } else if (2 === w) {
                    return p;
                } else if (3 === w) {
                    return f;
                }
            }
        }
    },
};
module.exports = util;