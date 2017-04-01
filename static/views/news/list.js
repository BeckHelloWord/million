/**
 * Created by hmc on 2016/7/7
 */
// 帮助中心

define(function (require, exports, module) {
    require("views/news/src/css.css");
    var sTpl = require("views/news/list.html");
    var iPublic = require("components/public.js");
    var NewsList = require("components/news/newsList.js");
    var API_GET = iPublic.API_GET;

    var list = Vue.extend({
		template: sTpl,
        // 列表
        components: {
            "newsList": NewsList
        },
        data:function(){
            return {
                newsList: [],
                code: 0,
                offset: 0,
                loading: false,
                getMore: false
            }
        },
        methods:{
            getList: function(offset, max){
                var that = this, rMax = max || 10, data = {cataLogCode: "news"};

                if(offset){
                    data.offset = offset * 10;
                    data.max = rMax;
                }

                that.loading = true;

                API_GET({
                    url:'wd_api/article/getArticleListOn',
                    data: data,
                    success: function (result) {
                        console.log(result);
                        var list = result.data;

                        if(list.length < 10){
                            that.getMore = true;
                        }

                        for(var i = 0, len = list.length; i < len; i++){
                            if(list[i].coverUrl){
                                list[i].coverUrl = iPublic.imgUrl(list[i].coverUrl);
                            }else{
                                list[i].coverUrl = "static/src/detail-banner-default.png";
                            }
                        }

                        if(offset){
                            that.newsList = that.newsList.concat(list);
                        }else{
                            that.newsList = list;
                        }

                        that.loading = false;
                    }
                });
            }
        },
        complied:function(){

        },
        created:function(){
            var that = this;

            //设置返回键
            this.$root.$children[0].showgoback = true;
            this.$root.$children[1].showfooter = false;
            this.$root.bodyColor='gray';

            //设置title
            this.$root.setTitle('资讯');
        },
        ready:function(){
            var that = this;

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

