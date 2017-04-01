/**
 * Created by hmc on 2016/7/7
 */
// 帮助中心

define(function (require, exports, module) {
    require("views/product/src/css.css");
    var sTpl = require("views/product/list.html");
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
                classify: [],
                productList: [],
                width: 0,
                code: 0,
                offset: 0,
                loading: false,
                getMore: false,
                typeCode: ""
            }
        },
        methods:{
            getClassify: function(){
                var that = this;

                API_GET({
                    url:'wd_api/product/getProductClassifyOn',
                    success: function (result) {
                        that.classify = result.data;

                        setTimeout(function(){
                            that.setWidth();

                            var codeId = sessionStorage.getItem("productCode");

                            if(codeId){
                                that.code = codeId;
                            }else{
                                that.getList();
                            }
                        }, 0);
                    }
                });
            },
            setWidth: function(){
                var width = window.innerWidth / 4,people = $(".people-list-title"), len = people.find("li").length - 1;

                people.find("ul").css({width: width * len});
                people.find("li").css({width: width});

                this.width = width;
            },
            titleCheck: function(e){
                var obj = $(e.currentTarget), ind = obj.index();

                this.code = ind;
                sessionStorage.setItem("productCode", ind);
            },
            getList: function(code, offset, max){
                var that = this, rMax = max || 10, data = {};

                if(code){
                    data.classifyId = code;
                }

                if(offset){
                    data.offset = offset * 10;
                    data.max = rMax;
                }

                that.loading = true;

                API_GET({
                    url:'wd_api/product/getProductOn',
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
            }
        },
        watch: {
            "code": function(val){
                var that = this, obj = $(".people-list-title li").eq(val);

                var code = obj.attr("data-code"), ind = obj.index(), len = obj.parent().find("li:not(:last-child)").length;

                that.typeCode = code;
                that.getMore = false;
                that.offset = 0;

                if(ind > 2 && ind < len - 1){
                    obj.parent().css({left: - that.width * (ind - 2)});
                }else if(ind == (len - 1) && len > 3){
                    obj.parent().css({left: - that.width * (ind - 3)});
                }else{
                    obj.parent().css({left: 0});
                }

                obj.parent().find("li.last").css({left: that.width * ind});

                if(code){
                    that.getList(code);
                }else{
                    that.getList();
                }

            }
        },
        created:function(){
            var that = this;

            //设置返回键
            this.$root.$children[0].showgoback = false;
            this.$root.$children[1].showfooter = true;
            //this.$root.bodyColor='gray';

            // 设置title
            this.$root.setTitle('产品');
        },
        ready:function(){
            var that = this;

            that.getClassify();

            (function(){
                $.init();

                // 注册'infinite'事件处理函数
                $(document).on('infinite', '.infinite-scroll-bottom',function() {
                    // 如果正在加载，则退出
                    if (that.loading || that.getMore) return;

                    var offset = that.offset + 1;

                    that.offset = offset;

                    if(that.typeCode){
                        that.getList(that.typeCode, offset);
                    }else{
                        that.getList(null, offset);
                    }
                });
            }());
        }
    });
    module.exports = list;
});

