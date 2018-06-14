const cfg = {
    http: 'http://',
    https: 'https://',
    host: '172.16.71.176:8080',
    host_cdn: 'l.bainianaolai.com',
    api: function () {//接口服务器域名
        return this.http + this.host;
    },
    cdn: function () {//cdn服务器域名
        return this.https + this.host_cdn;
    },
};
module.exports = cfg;