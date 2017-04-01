/**
 * Created by hmc on 2016/7/7
 */
// 帮助中心

define(function (require, exports, module) {
    require("views/center/src/css.css");
    var sTpl = require("views/center/attention.html");
    var iPublic = require("components/public.js");
    var ProductList = require("components/product/productList.js");//引入组件
    var ActivityList = require("components/activity/activityList.js");//引入组件
    var API_GET = iPublic.API_GET;

    var index = Vue.extend({
        template: sTpl,
        // 列表
        components: {
            "productList": ProductList,
            "activityList": ActivityList
        },//实例化组件
        data:function() {
            return {
                product: [],
                activity: [],
                showPart: true,
                persion: {},
                offset:10,
                loading: false,
                getMore: false,
            }
        },
        events: {//祖册组件事件
        },
        methods:{
            checkTitle: function(e){
                var obj = $(e.currentTarget),
                    wid = obj.width(),
                    index = obj.index();

                obj.addClass("on").siblings().removeClass("on");
                $(".attention-list-title ul li.last").css({left: wid * index});

                this.offset = 10;

                if(!!index){
                    this.showPart = false;
                }else{
                    this.showPart = true;
                }
            },
            showCancel:function(e){
                $(e.currentTarget).css("left", -60);
            },
            closeCancel:function(e){
                $(e.currentTarget).css("left", 0);
            },
            attentionCancel: function(e){
                var that = this,
                    obj = $(e.currentTarget),
                    id = obj.attr("data-attentionId"),
                    data = {
                        memberId: that.persion.memberId,
                        attentionId: id
                    };

                API_GET({
                    url: "wd_api/member/memberDeleteAttention", // 删除喜欢的东西
                    data: data,
                    success: function(result){
                        if(result.isSuccess){
                            if(that.showPart){
                                that.getProductList();
                            }else{
                                that.getActivityList();
                            }

                            $.toast("删除成功");
                        }else{
                            $.toast(result.message);
                        }
                    }
                });

                event.stopPropagation();
            },
            goDetail: function(event){
                var id = $(event.currentTarget).data("id");

                if(this.showPart){
                    this.$route.router.go({ name: 'product-detail', params: { id: id }});
                }else{
                    this.$route.router.go({ name: 'activity-detail', params: { id: id }});
                }
            },
            getProductList: function(offset, max){
                var that = this, rMax = max || 10, data = {
                    memberId: that.persion.memberId
                };

                if(offset){
                    data.offset = offset * 10;
                    data.max = rMax;
                }

                that.loading = true;

                API_GET({
                    url: "wd_api/member/memberAttentionProductOrder", //获取我喜欢的理财产品
                    data: data,
                    success: function(result){
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
                var that = this, rMax = max || 10, data = {
                    memberId: that.persion.memberId
                };

                if(offset){
                    data.offset = offset * 10;
                    data.max = rMax;
                }

                that.loading = true;

                API_GET({
                    url: "wd_api/member/memberAttentionOfflineActivity", //获取我喜欢的线下活动
                    data: data,
                    success: function(result){
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
            }
        },
        created:function(){
            this.$root.setTitle('关注 ');
            this.$root.$children[0].showgoback = true;
            this.$root.$children[1].showfooter = false;
        },
        ready:function(){
            this.persion = JSON.parse(sessionStorage.getItem("persion"));
            this.getProductList();
            this.getActivityList();

            var that = this;

            (function(){
                $.init();

                // 注册'infinite'事件处理函数
                $(document).on('infinite', '.infinite-scroll-bottom',function() {
                    // 如果正在加载，则退出
                    if (that.loading || that.getMore) return;

                    var offset = that.offset + 1;

                    that.offset = offset;

                    if(that.showPart){
                        that.getProductList(offset);
                    }else{
                        that.getActivityList(offset);
                    }
                });
            }());
        }
    });
    module.exports = index;
});

