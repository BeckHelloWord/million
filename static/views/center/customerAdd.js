/**
 * Created by hmc on 2016/7/7
 */
// 帮助中心

define(function (require, exports, module) {
    require("views/center/src/css.css");
    var sTpl = require("views/center/customerAdd.html");
    var iPublic = require("components/public.js");
    var API_GET = iPublic.API_GET;

    var index = Vue.extend({
		template: sTpl,
        // 列表
        components: {},//实例化组件
        data:function() {
            return {
                customer: [],
                persion: {}
            }
        },
        methods:{
            formSubmit: function(){
                var that = this, data = {},
                    customerName = $("#customerName").val();

                if(!customerName){
                    $.modal({
                        title: "提示",
                        text: "请输入姓名",
                        buttons: [{
                            text: "知道了"

                        }],
                        //onClick:function(){
                        //    history.back();
                        //},
                        extraClass: "errTips"
                    });

                    return false;
                }

                data.superId = that.persion.memberId;
                data.customerName = customerName;
                data.customerAge = $("#customerAge").val();
                data.information = $("#information").val();
                data.important = $("#important").val();
                data.remark = $("#remark").val();
                data.massage = $("#massage").val();

                API_GET({
                    url: "wd_api/customer/addSuperCustomer", // 添加理财师客户
                    data: data,
                    success: function(result){
                        if(result.isSuccess){
                            $.modal({
                                title: "提示",
                                text: "添加成功",
                                buttons: [{
                                    text: "知道了"

                                }],
                                onClick:function(){
                                    history.back();
                                },
                                extraClass: "sucTips"
                            });
                        }else{
                            $.modal({
                                title: "提示",
                                text: result.message,
                                buttons: [{
                                    text: "知道了"

                                }],
                                //onClick:function(){
                                //    history.back();
                                //},
                                extraClass: "errTips"
                            });
                        }
                    }
                });
            }
        },

        created:function(){
            this.$root.setTitle('新增客户');
            this.$root.$children[0].showgoback = true;
            this.$root.$children[1].showfooter = false;
            this.$root.bodyColor='gray noOver';
        },
        ready:function(){
            this.persion = JSON.parse(sessionStorage.getItem("persion"));
        }
    });
    module.exports = index;
});

