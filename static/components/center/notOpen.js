/**
 * Created by hmc on 2016/7/7
 */
// 帮助中心

define(function (require, exports, module) {
    var sTpl = require("components/center/notOpen.html");//引用组件

    var index = Vue.extend({
        template: sTpl,
        // 列表
        components: {},
        data:function(){

        },
        events: {

        },
        methods:{//组件内事件绑定
        },
        created:function(){//组件初始化方法
        },
        ready:function(){
            //$(".subscribe_nomsg").height(window.innerHeight-90)
        }

    });
    module.exports = index;
});

