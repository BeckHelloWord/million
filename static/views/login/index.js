define(function (require, exports, module) {
    require("views/login/src/style.css");
    var sTpl = require("views/login/index.html");
    var iPublic = require("components/public.js");
    var API_GET = iPublic.API_GET;

    var index = Vue.extend({
        template: sTpl,
        data: function () {
            return {
                'bannerTrans': {
                    "login-banner-trans": false
                },
                'linerLeft': {
                    left: ''
                },
                'loginBox': {
                    'login': true,
                    'register': false
                },
                'loginOn': {
                    'mobile': '',
                    'password': '',
                    'flg': true
                },
                'register': {
                    'nickname': '',
                    'mobile': '',
                    'verifyNo': '',
                    'password': '',
                    'flg': true
                },
                'validate': {
                    'state': true,
                    'txt': '获取验证码',
                    'lock': true,
                    'nickInfo': '',
                    'passInfo': ''
                },
                'openId': ''
            };
        },
        methods: {
            bindWx: function () {
                var that = this;
                if (this.openId) {
                    /*未绑定微信*/
                    API_GET({
                        url: 'wd_api/userCenter/bindPartner',
                        data: {
                            'openId': that.openId,
                            'partnerName': 'WEIXIN'
                        },
                        success: function (result) {
                            if (result.isSuccess) {

                            } else {
                                that.$parent.Popup(result.message);
                            }
                        }
                    });
                }
            },
            tabs: function (number) {
                /*tab切换*/
                this.linerLeft.left = number * 60 + "%";  //设置线条滑动

                if (!!number) {
                    //注册
                    this.loginBox.register = true;
                    this.loginBox.login = false;
                    this.$root.setTitle('注册');
                } else {
                    //登录
                    this.loginBox.register = false;
                    this.loginBox.login = true;
                    this.$root.setTitle('登录');
                }
            },
            Login: function () {
                /*登录*/
                var that = this;
                that.$parent.showLoading();
                API_GET({
                    url: 'wd_api/userCenter/loginOn',
                    data: {"username": this.loginOn.mobile, "password": this.loginOn.password},
                    success: function (result) {
                        that.$parent.hideLoading();
                        if (result.isSuccess) {
                            //存储登录信息
                            sessionStorage.setItem("persion", JSON.stringify(result.data));
                            that.bindWx();

                            /*登录跳转*/
                            that.$parent.skipUrl();
                        } else {
                            that.$parent.Popup(result.message);
                        }
                    }
                });

            },
            Register: function () {
                /*注册*/
                var that = this;
                if (!that.validate.nickInfo) {
                    if (!that.validate.passInfo) {
                        var data = {
                            "mobile": this.register.mobile,
                            "password": this.register.password,
                            "nickname": this.register.nickname,
                            "verifyNo": this.register.verifyNo
                        },
                            recommendCode = sessionStorage.getItem("recommendCode"),
                            source = sessionStorage.getItem("source");

                        if(recommendCode){
                            data.recommendCode = recommendCode;
                        }

                        if(source){
                            data.source = source;
                        }

                        that.$parent.showLoading();
                        API_GET({
                            url: 'wd_api/userCenter/loginMobileOn',
                            data: data,
                            success: function (result) {
                                that.$parent.hideLoading();
                                if (result.isSuccess) {
                                    /*存储登录信息*/
                                    sessionStorage.setItem("persion", JSON.stringify(result.data));
                                    that.bindWx();

                                    /*登录跳转*/
                                    that.$parent.skipUrl();

                                } else {
                                    that.$parent.Popup(result.message);
                                }
                            }
                        });
                    } else {
                        /*密码的错误信息*/
                        this.$parent.Popup(that.validate.passInfo);
                    }
                } else {
                    /*昵称的错误信息*/
                    this.$parent.Popup(that.validate.nickInfo);
                }

            },
            sendMobile: function () {
                /*获取验证码*/
                var that = this;
                if (that.validate.lock) {
                    var i = 120;
                    /*倒计时*/
                    function CountDown() {
                        var timer = setInterval(function () {
                            if (i <= 0) {
                                clearInterval(timer);
                                that.validate.txt = "重新发送";
                                that.validate.lock = true;
                            } else {
                                i--;
                                that.validate.txt = i + "秒后重新发送";
                            }
                        }, 1000);
                    }

                    API_GET({
                        url: 'wd_api/userCenter/sendVerifyForRegisterOn',
                        data: {"mobile": that.register.mobile},
                        success: function (result) {
                            if (result.isSuccess) {
                                that.validate.lock = false;
                                CountDown();
                            } else {
                                that.$parent.Popup(result.message);
                            }
                        }
                    });
                }
            },
            setLogDisabled: function () {
                /*设置登录按钮是否可点击*/
                this.$parent.verifyPhone(this.loginOn);
                this.loginOn.flg = this.$parent.check(this.loginOn);
            },
            setRegDisabled: function () {
                /*设置注册按钮是否可点击*/
                this.$parent.verifyPhone(this.register);
                this.$parent.verifyCode(this.register);
                this.register.flg = this.$parent.check(this.register);
            },
            GetQueryString: function(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                if(location.hash.split('?')[1]){
                    var r = location.hash.split('?')[1].match(reg);
                    if (r != null)return unescape(r[2]);
                }
                return null;
            }
        },
        created: function () {
            this.$root.setTitle('登录');
            this.$root.bodyColor = "bg-white";
            this.$root.$children[0].showgoback = false;

            /*默认选中注册*/
            if (location.hash.indexOf('register=open') != -1) {
                this.tabs(1);
                this.$root.setTitle('注册');
            }

            /*微信一键登录跳转*/
            var tokenVal = this.GetQueryString('accessToken'); //accessToken
            this.openId = this.GetQueryString('openId');  //openid
            if (tokenVal) {
                sessionStorage.setItem('persion', JSON.stringify({'accessToken': tokenVal}));
                this.$route.router.go("/center");
            }
        },
        ready: function () {
            var that = this;

            /*焦点动画*/
            $(".input-box input").on("focus", function () {
                that.bannerTrans["login-banner-trans"] = true;
            }).on("blur", function () {
                that.bannerTrans["login-banner-trans"] = false;
            });

        },
        route: {
            activate:function(transition) {
                if(transition.from.path&&transition.from.path.indexOf("center")){
                    sessionStorage.setItem("centerToLogin",true)
                }
                transition.next();
            }
        }
    });
    module.exports = index;
});

