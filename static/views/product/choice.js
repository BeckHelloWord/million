/**
 * Created by hmc on 2016/7/7
 */
// 帮助中心

define(function (require, exports, module) {
    require("views/product/src/css.css");
    var sTpl = require("views/product/choice.html");
    var iPublic = require("components/public.js");
    var API_GET = iPublic.API_GET;

    var index = Vue.extend({
		template: sTpl,
        // 列表
        components: {

        },
        data:function(){
            return {
                id: this.$route.params.id,
                persion: {},
                list: [],
                superId: ""
            }
        },
        methods:{
            getList: function(){
                var that = this, data = {
                    productId: that.id,
                    memberId: that.persion.memberId
                };

                API_GET({
                    url: "wd_api/product/getSubscribeSuper",
                    data: data,
                    success: function(result){
                        var list = result.data;

                        for(var i = 0, len = list.length; i < len; i++){
                            console.log(list[i].superAvatar);
                            if(list[i].superAvatar){
                                list[i].superAvatar = iPublic.publicArr.IMG_SERVER + list[i].superAvatar
                            }else{
                                list[i].superAvatar = iPublic.imgUrl()
                            }
                        }

                        that.list = list;
                    }
                });
            },
            choice: function(e){
                var obj = $(e.currentTarget);

                this.superId = obj.data("id");

                obj.addClass("on").siblings().removeClass("on");
            },
            goNext: function(){
                var that = this, len = $(".appointment-form .on").length, msg = "";

                if(len < 1){
                    msg = "请选择理财师";
                }

                if(msg){
                    $.modal({
                        title: "提示",
                        text: msg,
                        buttons: [],
                        extraClass: "errTips"
                    });

                    setTimeout(function(){
                        $.closeModal();
                    }, 2000)
                }else{
                    sessionStorage.setItem("superId", that.superId);

                    this.$route.router.go({ name: 'product-appointment', params: { id: this.id }});
                }
            }
        },
        created:function(){
            var that = this;

            //设置返回键
            this.$root.$children[0].showgoback = true;
            this.$root.$children[1].showfooter = false;

            //设置title
            this.$root.setTitle('选择理财师');
        },
        ready:function(){
            if(iPublic.isLogin()){  // 登录之后
                var persion = JSON.parse(sessionStorage.getItem("persion"));

                this.persion = persion;
            }

            this.getList();
        }
    });
    module.exports = index;
});

