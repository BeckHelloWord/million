/**
 * Created by yy on 2016/9/14.
 */
define(function (require, exports, module) {

    var vue = Vue.extend({
        template: '<router-view></router-view>',
        data: function () {
            return {
                loadState: true
            }
        },
        methods: {
            check: function (data) {
                /*校验用户数据*/

                var that = this.$children[0];

                /*校验是否能发送验证码*/
                for (var i in data) {
                    if (i == 'mobile') {
                        if (data[i].length != 0) {
                            that.validate.state = false;
                        } else {
                            that.validate.state = true;
                        }
                    }
                }

                /*校验昵称和密码*/
                for (var i in data) {
                    if (i == 'nickname') {
                        /*昵称*/
                        if (that.$root.isEmojiCharacter(data[i])) {
                            that.validate.nickInfo = '昵称不能包含表情';
                            break;
                        }
                        else if (data[i].length > 8) {
                            that.validate.nickInfo = '昵称过长，最多16字符，8个汉字';
                            break;

                        } else if (data[i].indexOf(" ") > 0) {
                            that.validate.nickInfo = '昵称不能包括空格';
                            break;
                        } else {
                            that.validate.nickInfo = '';
                        }
                    } else if (i == 'password') {
                        /*密码*/
                        if (that.$root.isEmojiCharacter(data[i])) {
                            that.validate.passInfo = '密码不能包含表情';
                            break;
                        }
                        else if (data[i].length < 6) {
                            that.validate.passInfo = '密码必须大于6位';
                            break;

                        } else if (data[i].length > 17) {
                            that.validate.passInfo = '密码必须小于17位';
                            break;
                        } else if (data[i].indexOf(" ") > 0) {
                            that.validate.passInfo = '密码不能包括空格';
                            break;
                        } else if (!/(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{7,16}$/.test(data[i])) {
                            that.validate.passInfo = '密码必须包含 数字、字母、符号三者中的两者';
                            break;
                        } else {
                            that.validate.passInfo = '';
                        }
                    }
                }

                /*校验所有信息是否输入*/
                for (var i in data) {
                    if (data[i].length == 0) {
                        return true;
                    }
                }
                return false;
            },
            verifyPhone: function (obj) {
                /*验证手机位数*/
                if (obj.mobile.length >= 11) {
                    obj.mobile = obj.mobile.substring(0, 11);
                }
            },
            verifyCode: function (obj) {
                /*验证验证码*/
                if (obj.verifyNo.length >= 6) {
                    obj.verifyNo = obj.verifyNo.substring(0, 6);
                }
            },
            skipUrl: function () {
                //url跳转
                var urlParameter = location.href.split("redirect=")[1];
                if(urlParameter){
                    urlParameter=urlParameter.substring(0,1)=="/"?urlParameter:"/"+urlParameter;
                }

                if (urlParameter) {
                    this.$route.router.go(urlParameter);
                } else {
                    this.$route.router.go("/center");
                }
            },
            Popup: function (info) {
                /*弹出框*/
                $.alert('', info);
            },
            showLoading: function () {
                /*load加载，断网状态提醒*/
                var that = this;
                $.showPreloader();
                setTimeout(function () {
                    if (that.loadState) {
                        that.Popup('网络错误，请稍后重试');
                        $.hidePreloader();
                        that.loadState = true;
                    }
                }, 10000)
            },
            hideLoading: function () {
                var that = this;
                that.loadState = false;
                $.hidePreloader();
            }
        },
        created: function () {
            this.$root.setTitle('登录');
            this.$root.$children[1].showfooter = false;
        }
    });
    module.exports = vue;
});