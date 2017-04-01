/**
 * Created by hmc on 2016/7/7
 */
// 帮助中心

define(function (require, exports, module) {
    require("views/financialPlanner/src/css.css");
    var sTpl = require("views/financialPlanner/comment.html");
    var iPublic = require("components/public.js");
    var API_GET = iPublic.API_GET;

    var index = Vue.extend({
		template: sTpl,
        // 列表
        components: {

        },
        data:function(){
            return {
                comment: [],
                offset: 0,
                loading: false,
                getMore: false
            }
        },
        methods:{
            getId: function(){
                var id = this.$route.params.id

                return id;
            },
            getComment: function(id, offset, max){
                var that = this, max = max || 10, data = {"superId": id};

                if(offset){
                    data = {
                        "superId": id,
                        "offset": offset,
                        "max": max
                    }
                }

                that.loading = true;

                API_GET({
                    url:'wd_api/microstation/getMicroStationDiscussOn',
                    data:data,
                    success: function (result) {
                        var list = result.data;

                        if(list.length < 10){
                            that.getMore = true;
                        }

                        for(var i = 0, len = list.length; i < len; i++){
                            list[i].avatar = iPublic.commentImgUrl(list[i].avatar);
                        }

                        if(offset){
                            that.comment = that.comment.concat(list);
                        }else{
                            that.comment = list;
                        }

                        that.loading = false;
                    }
                });
            }
        },
        created:function(){
            var that = this;

            //设置返回键
            this.$root.$children[0].showgoback = true;
            this.$root.$children[1].showfooter = false;

            //设置title
            this.$root.setTitle('评论');
        },
        ready:function(){
            var that = this, id = that.getId();

            that.getComment(id);

            // 注册'infinite'事件处理函数
            $(document).on('infinite', '.infinite-scroll-bottom',function() {
                // 如果正在加载，则退出
                if (that.loading || that.getMore) return;

                var offset = that.offset + 1;

                that.offset = offset;

                that.getComment(id, offset);
            });
        }
    });
    module.exports = index;
});

