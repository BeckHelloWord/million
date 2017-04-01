define(function (require, exports, module) {
    var sTpl = require("components/message/message.html");//引用组件

    var index = Vue.extend({
        template: sTpl,
        // 列表
        components: {},
        props: ["message"],//对外数据接口

        data: function(){
            return {
            }
        },
        events: {
        },
        methods:{//组件内事件绑定
        },
        created:function(){//组件初始化方法
        }
    });
    // Vue.filter("date",function (date) {
    //     return date.getFullYear() + '-' + date.getMonth() + '-' +date.getDay();
    // })
    module.exports = index;
});

