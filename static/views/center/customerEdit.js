/**
 * Created by hmc on 2016/7/7
 */
// 帮助中心

define(function (require, exports, module) {
    require("views/center/src/css.css");
    var sTpl = require("views/center/customerEdit.html");
    var iPublic = require("components/public.js");
    var API_GET = iPublic.API_GET;

    var index = Vue.extend({
		template: sTpl,
        // 列表
        components: {},//实例化组件
        data:function() {
            return {
                id: this.$route.params.id,
                persion: {},
                editBol: true,
                detail: [],
                investList: [],
                offset: 0,
                loading: false,
                getMore: false
            }
        },
        methods:{
            getDetail: function(){
                var that = this,
                    data = {
                        superId: that.persion.memberId,
                        customerId: that.id
                    };

                API_GET({
                    url: "wd_api/customer/getSuperCustomerDetail", // 获取理财师客户详情
                    data: data,
                    success: function(result){
                        that.detail = result.data;
                    }
                });
            },
            getInvestList: function(offset, max){
                var that = this, rMax = max || 10,
                    data = {
                        superId: that.persion.memberId,
                        customerId: that.id
                    };

                if(offset){
                    data.offset = offset * 10;
                    data.max = rMax;
                }

                that.loading = true;

                API_GET({
                    url: "wd_api/customer/getSuperCustomerProductDetail", // 获取理财师客户投资详情
                    data: data,
                    success: function(result){
                        var list = result.data;

                        if(list.length < 10){
                            that.getMore = true;
                        }

                        if(offset){
                            that.investList = that.investList.concat(list);
                        }else{
                            that.investList = list;
                        }

                        if(that.investList.length < 4){
                            $(".invest-item").css({height: that.investList.length * 109 + "px"});
                        }else{
                            $(".invest-item").css({height:"436px"});
                        }

                        that.loading = false;
                    }
                });
            },
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
                        extraClass: "errTips"
                    });

                    return false;
                }

                data.superId = that.persion.memberId;
                data.customerId = that.id;
                data.customerName = customerName;
                data.customerAge = $("#customerAge").val();
                data.information = $("#information").val();
                data.important = $("#important").val();
                data.remark = $("#remark").val();
                data.massage = $("#massage").val();

                API_GET({
                    url: "wd_api/customer/updateSuperCustomer", // 修改理财师客户
                    data: data,
                    success: function(result){
                        if(result.isSuccess){
                            $.modal({
                                title: "提示",
                                text: "保存成功",
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
                                extraClass: "errTips"
                            });
                        }
                    }
                });
            },
            add: function(){
                this.editBol = false;
            },
            investCancel: function(){
                this.editBol = true;
            },
            investAdd: function(){
                var that = this,
                    data = {
                        superId: that.persion.memberId,
                        customerId: that.id
                    }, bol = false;

                $(".invest-add input").each(function(){
                    var _this = $(this),
                        val = _this.val(),
                        txt = _this.parent().prev().text();

                    if(!val){
                        $.modal({
                            title: "提示",
                            text: "请输入" + txt,
                            buttons: [{
                                text: "知道了"

                            }],
                            extraClass: "errTips"
                        });

                        bol = true;
                        return false;
                    }
                });

                if(bol){
                    return false;
                }

                data.productName = $("#productName").val();
                data.investMoney = $("#investMoney").val();
                data.investLimit = $("#investLimit").val();
                data.investStartDay = $("#investStartDay").val();
                data.investEndDay = $("#investEndDay").val();

                API_GET({
                    url: "wd_api/customer/addSuperCustomerInvest", // 添加理财师客户投资信息
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
                                    that.editBol = true;
                                    that.getInvestList();
                                    that.offset = 0;
                                    that.getMore = false;
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
                                extraClass: "errTips"
                            });
                        }
                    }
                });
            },
            showCancel:function(e){
                $(e.currentTarget).css("left", -60);
            },
            closeCancel:function(e){
                $(e.currentTarget).css("left", 0);
            },
            delete: function(id){
                var that = this,
                    data = {
                        superId: that.persion.memberId,
                        customerInvestId: id
                    };

                API_GET({
                    url: "wd_api/customer/deleteSuperCustomerInvest", // 删除理财师客户
                    data: data,
                    success: function(result){
                        if(result.isSuccess){
                            $.toast("删除成功");
                            that.getInvestList();
                            that.offset = 0;
                            that.getMore = false;
                        }else{
                            $.toast(result.message);
                        }
                    }
                });

                event.stopPropagation();
            }
        },

        created:function(){
            this.persion = JSON.parse(sessionStorage.getItem("persion"));
            this.getDetail();
            this.getInvestList();

            this.$root.setTitle('客户资料编辑');
            this.$root.$children[0].showgoback = true;
            this.$root.$children[1].showfooter = false;
            this.$root.bodyColor='gray noOver';
        },
        ready:function(){
            var that = this;

            (function(){
                $.init();

                // 注册'infinite'事件处理函数
                $(document).on('infinite', '.infinite-scroll-bottom',function() {
                    // 如果正在加载，则退出
                    if (that.loading || that.getMore) return;

                    var offset = that.offset + 1;

                    that.offset = offset;

                    that.getInvestList(offset);
                });
            }());
        }
    });
    module.exports = index;
});

