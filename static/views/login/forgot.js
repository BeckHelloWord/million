/**
 * Created by yy on 2016/9/14.
 * 找回密码
 */
define(function (require, exports, module) {
    require("views/login/src/style.css");
    var sTpl = require("views/login/forgot.html");
    var iPublic = require("components/public.js");
    var API_GET = iPublic.API_GET;

    var index = Vue.extend({
        template: sTpl,
        data: function () {
            return {
                forget: {
                    'mobile': '',
                    'verifyNo': '',
                    'password': '',
                    'flg': true
                },
                'validate': {
                    'state': true,
                    'txt': '获取验证码',
                    'lock': true,
                    'passInfo': ''
                }
            }
        },
        methods: {
            getVerifyNo: function () {
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

                    that.$parent.showLoading();
                    API_GET({
                        url: 'wd_api/userCenter/sendRetrievePwdCodeOn',
                        data: {
                            'mobile': that.forget.mobile,
                            'voice': false
                        },
                        success: function (result) {
                            that.$parent.hideLoading();
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
            findPassword: function () {
                /*找回密码*/
                var that = this;
                if (!that.validate.passInfo) {
                    that.$parent.showLoading();
                    API_GET({
                        url: 'wd_api/userCenter/doRetrievePwdResetOn',
                        data: {
                            'mobile': that.forget.mobile,
                            'code': that.forget.verifyNo,
                            'newPwd': that.forget.password
                        },
                        success: function (result) {
                            that.$parent.hideLoading();
                            if (result.isSuccess) {
                                that.$route.router.go("index");
                            } else {
                                that.$parent.Popup(result.message);
                            }
                        }
                    });
                } else {
                    this.$parent.Popup(that.validate.passInfo);
                }


            },
            setDisabled: function () {
                /*设置注册按钮是否可点击*/
                this.forget.flg = this.$parent.check(this.forget);
                this.$parent.verifyPhone(this.forget);
                this.$parent.verifyCode(this.forget);
            }
        },
        created: function () {
            this.$root.setTitle('忘记密码');
            this.$root.bodyColor = "bg-purple";
            this.$root.$children[0].showgoback = true;
        }
    });
    module.exports = index;
});

