/**
 * Created by hmc on 2016/7/7
 */
// 帮助中心

define(function (require, exports, module) {
    require("views/product/src/css.css");
    var sTpl = require("views/product/appointment.html");
    var iPublic = require("components/public.js");
    var API_GET = iPublic.API_GET;

    var index = Vue.extend({
		template: sTpl,
        // 列表
        components: {

        },
        data:function(){
            return {
                formData: {
                    productId: this.$route.params.id,
                    productClassify: "",
                    investAmount: "",
                    content: "",
                },
                persion: ""
            }
        },
        methods:{
            getId: function(){
                var id = this.$route.params.id;

                return id;
            },
            formAjaxSubmit: function(){
                var that = this, msg = "";

                if(that.formData.productClassify == ""){
                    msg = "请选择至少一项产品类型";
                }else if(that.formData.investAmount == ""){
                    msg = "请选择您的可投资金";
                }else if(that.formData.content == ""){
                    msg = "请选择您的咨询内容";
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
                    API_GET({
                        url: "wd_api/product/memberProductSubscribe",
                        data:that.formData,
                        success: function(response){
                            if(response.isSuccess){
                                $.modal({
                                    title: "预约成功",
                                    text: "请等待理财师回应",
                                    buttons: [{
                                        text: "知道了"
                                    }],
                                    onClick:function(){
                                        history.go(-1);
                                    },
                                    extraClass: "sucTips"
                                });
                            }else{
                                $.modal({
                                    title: "提示",
                                    text: response.message,
                                    buttons: [{
                                        text: "知道了"
                                    }],
                                    extraClass: "errTips"
                                });
                            }

                        }
                    });

                }
            }
        },
        created:function(){
            var that = this;

            //设置返回键
            this.$root.$children[0].showgoback = true;
            this.$root.$children[1].showfooter = false;

            //设置title
            this.$root.setTitle('预约');
        },
        ready:function(){
            var that = this, id = that.getId(), arr = [];

            that.persion = JSON.parse(sessionStorage.getItem("persion"));

            $(".productClassify li").on("click", function(){
                var $this = $(this),
                    txt = $this.find("span").text();

                if($this.hasClass("active")){
                    var ind = arr.indexOf(txt);

                    $this.removeClass("active");
                    arr.splice(ind, 1);
                    that.formData.productClassify = arr.toString();

                    return false;
                }

                $this.addClass("active");
                arr.push(txt);
                that.formData.productClassify = arr.toString();
            });

            $(".investAmount li").on("click", function(){
                var txt = $(this).find("span").text();

                $(this).addClass("active").siblings().removeClass("active");
                that.formData.investAmount = txt;
            });

            $(".appointment-form textarea").on("input", function(){
                var $this = $(this), len = $this.val().length, txt = $this.val();

                $("#num").text(len);
                that.formData.content = txt;
            });
        }
    });
    module.exports = index;
});

