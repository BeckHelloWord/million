/**
 * Created by hmc on 2016/7/7
 */
// 帮助中心

define(function (require, exports, module) {
    var sTpl = require("components/banner/bannerSlider.html");//引用组件
    var iPublic = require("components/public.js");

    var index = Vue.extend({
        template: sTpl,
        // 列表
        components: {},
        props: ["sliders"],//对外数据接口
        data:{

        },
        events: {

        },
        methods:{//组件内事件绑定
            goToDetail: function(){
                var id = $(event.currentTarget).data("id");

                this.$route.router.go({ name: 'detail', params: { id: id }});
            }
        },
        created:function(){//组件初始化方法
            this.sliders.img = iPublic.publicArr.IMG_SERVER + this.sliders.img;
        }
    });
    module.exports = index;
});

