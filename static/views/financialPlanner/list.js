/**
 * Created by hmc on 2016/7/7
 */
// 帮助中心

define(function (require, exports, module) {
    require("views/financialPlanner/src/css.css");
    var sTpl = require("views/financialPlanner/list.html");
    var iPublic = require("components/public.js");
    var PeopleList = require("components/people/peopleList.js");
    var API_GET = iPublic.API_GET;

    var index = Vue.extend({
		template: sTpl,
        // 列表
        components: {
            "peopleList": PeopleList
        },
        data:function(){
            return {
                peopleListTitle: [],
                peopleList: [],
                width: 0,
                code: 0,
                offset: 0,
                loading: false,
                getMore: false,
                typeCode: ""
            }
        },
        methods:{
            getPeopleList: function(type, offset, max){
                var that = this, max = max || 10, data = {"memberTypeCode": type};

                if(offset){
                    data = {
                        "memberTypeCode": type,
                        "offset": offset,
                        "max": max
                    }
                }

                that.loading = true;

                API_GET({
                    url:'wd_api/microstation/getSuperListOn',
                    data: data,
                    success: function (result) {
                        var list = result.data;

                        if(list.length < 10){
                            that.getMore = true;
                        }

                        for(var i = 0, len = list.length; i < len; i++){
                            list[i].avatar = iPublic.imgUrl(list[i].avatar);
                        }

                        if(offset){
                            that.peopleList = that.peopleList.concat(list);
                        }else{
                            that.peopleList = list;
                        }

                        that.loading = false;
                    }
                });
            },
            getAllPeople: function(offset, max){
                var that = this, rMax = max || 10, data = {};

                if(offset){
                    data = {
                        "offset": offset * 10,
                        "max": rMax
                    }
                }

                that.loading = true;

                API_GET({
                    url:'wd_api/microstation/getSuperListOn',
                    data: data,
                    success: function (result) {
                        var list = result.data;

                        if(list.length < 10){
                            that.getMore = true;
                        }

                        for(var i = 0, len = list.length; i < len; i++){
                            list[i].avatar = iPublic.imgUrl(list[i].avatar);
                        }

                        if(offset){
                            that.peopleList = that.peopleList.concat(list);
                        }else{
                            that.peopleList = list;
                        }

                        that.loading = false;
                    }
                });
            },
            getPeopleListTitle: function(){
                var that = this;

                API_GET({
                    url:'wd_api/microstation/getSuperTypeOn',
                    success: function (result) {
                        that.peopleListTitle = result.data;

                        setTimeout(function(){
                            that.setWidth();

                            var codeId = sessionStorage.getItem("code");

                            if(codeId){
                                that.code = codeId;
                            }else{
                                that.getAllPeople();
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
                sessionStorage.setItem("code", ind);
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
                    that.getPeopleList(code);
                }else{
                    that.getAllPeople();
                }

            }
        },
        created:function(){
            var that = this;

            //设置返回键
            this.$root.$children[0].showgoback = true;
            this.$root.$children[1].showfooter = false;
            this.$root.bodyColor='gray';
        },
        ready:function(){
            var that = this;

            this.getPeopleListTitle();

            (function(){
                $.init();

                // 注册'infinite'事件处理函数
                $(document).on('infinite', '.infinite-scroll-bottom',function() {
                    // 如果正在加载，则退出
                    if (that.loading || that.getMore) return;

                    var offset = that.offset + 1;

                    that.offset = offset;

                    if(that.typeCode){
                        that.getPeopleList(offset);
                    }else{
                        that.getAllPeople(offset);
                    }
                });
            }());
        }
    });
    module.exports = index;
});

