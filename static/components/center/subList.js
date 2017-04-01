/**
 * Created by hmc on 2016/7/7
 */
// 帮助中心

define(function (require, exports, module) {
    var sTpl = require("components/center/subList.html");//引用组件
    var iPublic = require("components/public.js");
    var API_GET = iPublic.API_GET;
    var index = Vue.extend({
        template: sTpl,
        // 列表
        components: {},
        props: ["sub"],//对外数据接口
        data:function(){
           return{ "persion":JSON.parse(sessionStorage.getItem("persion"))}
        },
        events: {

        },
        methods:{//组件内事件绑定
            showCancel:function(e){
                $(this.$el.childNodes[1]).css("margin-left",-60)
            },
            closeCancel:function(e){
                $(this.$el.childNodes[1]).css("margin-left",0)
            },
            toDetail:function(){
                var _this=this
                this.$route.router.go("/financialPlanner/detail/"+_this.sub.superId)
            },
            doCancel:function(e){
                $(this.$el.childNodes[1]).css("margin-left",0)
                var _this=this
                API_GET({
                    url:'wd_api/member/memberCancelSubScribe',//用户取消预约接口
                    data: {"subscribeId":_this.sub.subscribeId},
                    success: function (result) {
                        if(result.isSuccess){
                            _this.$el.remove()
                            $.alert("取消成功")
                        }
                    }
                });

                //console.log(this.sub.subscribeId)
                e.stopPropagation()
            },
            toPingJia:function(e){
                sessionStorage.setItem("comment",JSON.stringify({superId:this.sub.superId,subscribeId:this.sub.subscribeId}))
                this.$route.router.go('/center/comment')
                e.stopPropagation()
            }
        },
        created:function(){//组件初始化方法
            this.sub.avatar=iPublic.imgUrl(this.sub.avatar)
        }
    });
    module.exports = index;
});

