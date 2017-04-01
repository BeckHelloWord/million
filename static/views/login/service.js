/**
 * Created by yy on 2016/9/14.
 */
define(function (require, exports, module) {
    require("views/login/src/style.css");
    var sTpl = require("views/login/service.html");
    var iPublic = require("components/public.js");
    var API_GET = iPublic.API_GET;

    var index = Vue.extend({
        template: sTpl,
        data: function () {
            return {
                'info': ''
            }
        },
        methods: {},
        created: function () {
            this.$root.$children[0].showgoback = true;
            this.$parent.showLoading();
            var that = this;
            API_GET({
                url: 'wd_api/about/getMemberProtocolOn',
                data: {
                    'typeCode': 'registerProtocol'
                },
                success: function (result) {
                    that.$parent.hideLoading();
                    if (result.isSuccess) {
                        that.$root.setTitle(result.data.title);
                        that.info = result.data.content;
                    } else {
                        that.$parent.Popup(result.message);
                    }
                }
            });
        }
    });
    module.exports = index;
})
;

