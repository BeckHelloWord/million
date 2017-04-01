/**
 * Created by hmc on 2016/7/7
 */
// 帮助中心

define(function (require, exports, module) {
    var sTpl = require("components/activity/activityList.html");//引用组件

    var index = Vue.extend({
        template: sTpl,
        // 列表
        components: {},
        props: ["lists"],//对外数据接口
        data:{

        },
        events: {

        },
        methods:{//组件内事件绑定
            goDetail: function(event){
                var id = $(event.currentTarget).data("id");
                this.$route.router.go({ name: 'activity-detail', params: { id: id }});
            }
        },
        created:function(){//组件初始化方法

        }
    });
    module.exports = index;
});

