/**
 * Created by hmc on 2016/7/7
 */
// 帮助中心

define(function (require, exports, module) {
    require("views/activity/src/css.css");
    var sTpl = require("views/activity/list.html");
    var iPublic = require("components/public.js");
    var ActivityList = require("components/activity/activityList.js");
    var API_GET = iPublic.API_GET;

    var list = Vue.extend({
		template: sTpl,
        // 列表
        components: {
            "activityList": ActivityList
        },
        data:function(){
            return {
                activityList: [],
                code: 0,
                offset: 0,
                loading: false,
                getMore: false
            }
        },
        methods:{
            getList: function(offset, max){
                var that = this, rMax = max || 10, data = {};

                if(offset){
                    data.offset = offset * 10;
                    data.max = rMax;
                }

                that.loading = true;

                API_GET({
                    url:'wd_api/offlineActivity/getOfflineActivityOn',
                    data: data,
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
                            that.activityList = that.activityList.concat(list);
                        }else{
                            that.activityList = list;
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
            this.$root.$children[0].showgoback = false;
            this.$root.$children[1].showfooter = true;
            //this.$root.bodyColor='gray';

            //设置title
            this.$root.setTitle('活动');
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

