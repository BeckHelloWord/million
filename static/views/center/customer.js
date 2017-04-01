/**
 * Created by hmc on 2016/7/7
 */
// 帮助中心

define(function (require, exports, module) {
    require("views/center/src/css.css");
    var sTpl = require("views/center/customer.html");
    var iPublic = require("components/public.js");
    var API_GET = iPublic.API_GET;

    var index = Vue.extend({
		template: sTpl,
        // 列表
        components: {},//实例化组件
        data:function() {
            return {
                customer: [],
                persion: {},
                offset: 0,
                loading: false,
                getMore: false
            }
        },
        methods:{
            getList: function(offset, max){
                var that = this, rMax = max || 10,
                    data = {
                        superId: that.persion.memberId
                    };

                if(offset){
                    data.offset = offset * 10;
                    data.max = rMax;
                }

                that.loading = true;

                API_GET({
                    url: "wd_api/customer/getSuperCustomerList", // 获取理财师客户列表
                    data: data,
                    success: function(result){
                        var list = result.data;

                        if(list.length < 10){
                            that.getMore = true;
                        }

                        if(offset){
                            that.customer = that.customer.concat(list);
                        }else{
                            that.customer = list;
                        }

                        that.loading = false;
                    }
                });
            },
            add: function(){
                this.$route.router.go("/center/customerAdd");
            },
            goDetail: function(id){
                this.$route.router.go({ name: 'customer-edit', params: { id: id }});
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
                        customerId: id
                    };

                API_GET({
                    url: "wd_api/customer/deleteSuperCustomer", // 删除理财师客户
                    data: data,
                    success: function(result){
                        if(result.isSuccess){
                            $.toast("删除成功");
                            that.getList();
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
            this.$root.setTitle('客户');
            this.$root.$children[0].showgoback = true;
            this.$root.$children[1].showfooter = false;
        },
        ready:function(){
            var that = this;

            that.persion = JSON.parse(sessionStorage.getItem("persion"));
            that.getList();

            (function(){
                $.init();

                // 注册'infinite'事件处理函数
                $(document).on('infinite', '.infinite-scroll-bottom',function() {
                    // 如果正在加载，则退出
                    if (that.loading || that.getMore) return;

                    var offset = that.offset + 1;

                    that.offset = offset;

                    that.getList(offset);
                });
            }());
        }
    });
    module.exports = index;
});

