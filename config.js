const cfg = {
    http: 'http://',
    https: 'https://',
    host: 'webmobileapi.bainianaolai.com',
    host_cdn: 'l.bainianaolai.com',
    api: function () {//接口服务器域名
        return this.https + this.host;
    },
    cdn: function () {//cdn服务器域名
        return this.https + this.host_cdn;
    },
};
module.exports = cfg;