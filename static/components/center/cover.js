/**
 * Created by hmc on 2016/7/7
 */
// 帮助中心

define(function (require, exports, module) {
    var sTpl = require("components/center/cover.html");//引用组件

    var index = Vue.extend({
        template: sTpl,
        // 列表
        components: {},
        data:function(){

        },
        events: {
            showCover:function (title,txt) {
                $("#cover").css("display","block");
                $("#coverText").css("display","block");
                if(title)$("#coverTitle").html(title);
                if(txt) $("#coverTips").html(txt);
                //$("#coverText").css("width",document.body.clientWidth*0.6)
            }
        },
        methods:{//组件内事件绑定
            showCover:function () {
                $("#cover").css("display","block");
                $("#coverText").css("display","block");
                //$("#coverText").css("width",document.body.clientWidth*0.6)
            },
            closeCover:function () {
                $("#cover").css("display","none");
                $("#coverText").css("display","none");
            }
        },
        created:function(){//组件初始化方法
        },
        ready:function(){
            $("#cover").css("display","none");
            $("#coverText").css("display","none");
        }

    });
    module.exports = index;
});

