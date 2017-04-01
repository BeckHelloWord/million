/**
 * Created by hmc on 2016/7/7
 */
// 帮助中心

define(function (require, exports, module) {
    require("views/appoint/src/css.css");
    var sTpl = require("views/appoint/list.html");
    var iPublic = require("components/public.js");
    var ActivityList = require("components/activity/activityList.js");
    var ProductList = require("components/product/productList.js");
    var API_GET = iPublic.API_GET;

    var list = Vue.extend({
		template: sTpl,
        // 列表
        components: {
            "activityList": ActivityList,
            "productList": ProductList
        },
        data:function(){
            return {
                persion: {},
                levelCode: false,
                showPart: true,
                product: [],
                activity: [],
                customer: [],
                offset: 0,
                loading: false,
                getMore: false
            }
        },
        methods:{
            getCustomerList: function(offset, max){
                var that = this, rMax = max || 10, data = {};

                if(offset){
                    data.offset = offset * 10;
                    data.max = rMax;
                }

                that.loading = true;

                API_GET({
                    url:'wd_api/microstation/getSuperSubscribeBySuper',
                    data: {superId: that.persion.memberId},
                    success: function (result) {
                        var list = result.data;

                        if(list.length < 10){
                            that.getMore = true;
                        }

                        for(var i = 0, len = list.length; i < len; i ++){
                            list[i].avatar = iPublic.imgUrl(list[i].avatar);
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
            getProductList: function(offset, max){
                var that = this, rMax = max || 10, data = {};

                if(offset){
                    data.offset = offset * 10;
                    data.max = rMax;
                }

                that.loading = true;

                API_GET({
                    url:'wd_api/member/getProductSubScribeOrder',
                    data: {memberId: that.persion.memberId},
                    success: function (result) {
                        var list = result.data;

                        if(list.length < 10){
                            that.getMore = true;
                        }

                        if(offset){
                            that.product = that.product.concat(list);
                        }else{
                            that.product = list;
                        }

                        that.loading = false;
                    }
                });
            },
            getActivityList: function(offset, max){
                var that = this, rMax = max || 10, data = {};

                if(offset){
                    data.offset = offset * 10;
                    data.max = rMax;
                }

                that.loading = true;

                API_GET({
                    url:'wd_api/member/getOfflineActivityApplyOrder',
                    data: {memberId: that.persion.memberId},
                    success: function (result) {
                        var list = result.data;

                        if(list.length < 10){
                            that.getMore = true;
                        }

                        for(var i = 0, len = list.length; i < len; i++){
                            if(list[i].activityImageContent){
                                list[i].activityImageContent = iPublic.imgUrl(list[i].activityImageContent);
                            }else{
                                list[i].activityImageContent = "static/src/activity-default.png";
                            }

                            if(list[i].activityStatus == "registration"){
                                list[i].btnName = "报名中";
                            }else if(list[i].activityStatus == "registrationend"){
                                list[i].btnName = "进行中";
                            }else if(list[i].activityStatus == "end"){
                                list[i].btnName = "已结束";
                            }
                        }

                        if(offset){
                            that.activity = that.activity.concat(list);
                        }else{
                            that.activity = list;
                        }

                        that.loading = false;
                    }
                });
            },
            checkTitle: function(e){
                var obj = $(e.currentTarget),
                    wid = obj.width(),
                    index = obj.index();

                obj.addClass("on").siblings().removeClass("on");
                $(".appoint-list-title ul li.last").css({left: wid * index});

                if(!!index){
                    this.showPart = false;
                }else{
                    this.showPart = true;
                }
            }
        },
        created:function(){
            //设置返回键
            this.$root.$children[0].showgoback = false;
            this.$root.$children[1].showfooter = true;
            this.$root.bodyColor='gray';
        },
        ready:function(){
            var form = sessionStorage.getItem("fromAppointment");

            if(iPublic.isLogin()){
                this.persion = JSON.parse(sessionStorage.getItem("persion"));

                if(this.persion.levelCode){
                    this.levelCode = true;
                    this.getCustomerList();
                    this.getActivityList();
                }else{
                    this.levelCode = false;
                    this.getProductList();
                    this.getActivityList();
                }

                sessionStorage.removeItem("fromAppointment");
            }else{
                this.$route.router.go('/login/index?redirect=appoint');

                if(form){
                    this.$route.router.go('/financialPlanner');

                    sessionStorage.removeItem("fromAppointment");
                }else{
                    sessionStorage.setItem("fromAppointment", true);
                }

                return false;
            }

            var that = this;

            (function(){
                $.init();

                // 注册'infinite'事件处理函数
                $(document).on('infinite', '.infinite-scroll-bottom',function() {
                    // 如果正在加载，则退出
                    if (that.loading || that.getMore) return;

                    var offset = that.offset + 1;

                    that.offset = offset;

                    if(that.persion.levelCode){
                        if(that.showPart){
                            that.getProductList();
                        }else{
                            that.getActivityList();
                        }
                    }else{
                        if(that.showPart){
                            that.getCustomerList();
                        }else{
                            that.getActivityList();
                        }
                    }
                });
            }());
        }
    });
    module.exports = list;
});

