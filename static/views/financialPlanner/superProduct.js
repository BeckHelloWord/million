/**
 * Created by hmc on 2016/7/7
 */
// 帮助中心

define(function (require, exports, module) {
    require("views/product/src/css.css");
    var sTpl = require("views/financialPlanner/superProduct.html");
    var iPublic = require("components/public.js");
    var ProductList = require("components/product/productList.js");
    var API_GET = iPublic.API_GET;

    var list = Vue.extend({
		template: sTpl,
        // 列表
        components: {
            "productList": ProductList
        },
        data:function(){
            return {
                id: this.$route.params.id,
                productList: [],
                offset: 0,
                loading: false,
                getMore: false,
                persion: {},
                levelCode: true
            }
        },
        methods:{
            getList: function(offset, max){
                var that = this, rMax = max || 10, data = {superId: that.id};

                if(offset){
                    data.offset = offset * 10;
                    data.max = rMax;
                }

                that.loading = true;

                API_GET({
                    url:'wd_api/microstation/getMicroStationListOn',
                    data: data,
                    success: function (result) {
                        var list = result.data;

                        if(list.length < 10){
                            that.getMore = true;
                        }

                        if(offset){
                            that.productList = that.productList.concat(list);
                        }else{
                            that.productList = list;
                        }

                        that.loading = false;
                    }
                });
            },
            showCancel:function(e){
                $(e.currentTarget).css("left", -60);
            },
            closeCancel:function(e){
                $(e.currentTarget).css("left", 0);
            },
            productCancel: function(e){
                var that = this,
                    obj = $(e.currentTarget),
                    id = obj.attr("data-id"),
                    data = {
                        memberId: that.persion.memberId,
                        productId: id
                    };

                API_GET({
                    url: "wd_api/microstation/deleteMicroStationProduct", // 删除喜欢的东西
                    data: data,
                    success: function(result){
                        if(result.isSuccess){
                            $.toast("删除成功");

                            that.getList();
                        }else{
                            $.toast(result.message);
                        }
                    }
                });

                event.stopPropagation();
            }
        },
        created:function(){
            var that = this;

            //设置返回键
            this.$root.$children[0].showgoback = true;
            this.$root.$children[1].showfooter = false;
            this.$root.bodyColor='gray';

            //设置title
            this.$root.setTitle('产品');
        },
        ready:function(){
            var that = this;

            if( iPublic.isLogin()){
                that.persion = JSON.parse(sessionStorage.getItem("persion"));

                if(that.persion.levelCode){
                    that.levelCode = false;
                }
            }

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
    module.exports = list;
});

