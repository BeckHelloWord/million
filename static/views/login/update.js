/**
 * Created by yy on 2016/9/14.
 */
define(function (require, exports, module) {
    require("views/login/src/style.css");
    var sTpl = require("views/login/update.html");
    var iPublic = require("components/public.js");
    var API_GET = iPublic.API_GET;

    var index = Vue.extend({
        template: sTpl,
        data: function () {
            return {
                'updateInfo': {
                    'oldPassWord': '',
                    'password': '',
                    'confirmPassWord': '',
                    'accessToken': '',
                    'flg': true
                },
                'validate': {
                    'passInfo': ''
                }
            }
        },
        methods: {
            'update': function () {
                /*修改密码*/
                var that = this;
                if (!that.validate.passInfo) {
                    if (that.updateInfo.confirmPassWord == that.updateInfo.password) {
                        that.$parent.showLoading();
                        API_GET({
                            url: 'wd_api/userCenter/editPassword',
                            data: {
                                // 'memberId': that.updateInfo.memberId,
                                'oldPassword': that.updateInfo.oldPassWord,
                                'newPassword': that.updateInfo.password
                            },
                            success: function (result) {
                                that.$parent.hideLoading();
                                if (result.isSuccess) {
                                    that.$route.router.go("/center");
                                } else {
                                    that.$parent.Popup(result.message);
                                }
                            }
                        });

                    } else {
                        that.$parent.Popup("两次密码不一致");
                    }
                } else {
                    this.$parent.Popup(that.validate.passInfo);
                }

            },
            'setDisabled': function () {
                /*设置注册按钮是否可点击*/
                // this.updateInfo.flg = this.check(this.updateInfo);
                this.updateInfo.flg = this.$parent.check(this.updateInfo);
            }
        },
        created: function () {
            this.$root.setTitle('修改登录密码');
            this.$root.bodyColor = "bg-purple";
            this.$root.$children[0].showgoback = true;

            try {
                /*用户*/
                this.updateInfo.accessToken = JSON.parse(sessionStorage.getItem('persion')).accessToken;
            } catch (e) {
                this.$route.router.go("/login/index");
            }
        }
    });
    module.exports = index;
});

