/**
 * Created by hmc on 2016/7/7
 */
// 帮助中心

define(function (require, exports, module) {
    require("views/financialPlanner/src/css.css");
    var sTpl = require("views/financialPlanner/index.html");
    var iPublic = require("components/public.js");
    var BannerSlider = require("components/banner/bannerSlider.js");
    var PeopleList = require("components/people/peopleList.js");
    var NewsList = require("components/news/newsList.js");
    var ActivityList = require("components/activity/activityList.js");
    var ProductList = require("components/product/productList.js");
    var API_GET = iPublic.API_GET;

    var index = Vue.extend({
		template: sTpl,
        // 列表
        components: {
            "bannerSlider": BannerSlider,
            "peopleList": PeopleList,
            "newsList": NewsList,
            "activityList": ActivityList,
            "productList": ProductList
        },
        data:function(){
            return {
                banner: [],
                news: [],
                activity: [],
                product: []
            }
        },
        methods:{
            getBanner: function(){
                var that = this;

                API_GET({
                    url:'wd_api/banner/getBannerH5On',
                    success: function (result) {
                        var list = result.data;

                        for(var i = 0, len = result.data.length; i < len; i++){
                            list[i].imgUrl = iPublic.imgUrl(list[i].imgUrl);
                        }

                        that.banner = list;

                        setTimeout(function(){ $.init(); }, 0);
                    }
                });
            },
            getRecommend: function(){
                var that = this;

                API_GET({
                    url:'wd_api/recommend/homePageRecommendOn',
                    success: function (result) {
                        that.news = result.data.newsInfo;

                        if(that.news){
                            if(that.news[0].coverUrl){
                                that.news[0].coverUrl = iPublic.imgUrl(that.news[0].coverUrl);
                            }else{
                                that.news[0].coverUrl = "static/src/detail-banner-default.png";
                            }
                        }

                        that.activity = result.data.activity;

                        if(that.activity){
                            if(that.activity[0].activityImageContent){
                                that.activity[0].activityImageContent = iPublic.publicArr.IMG_SERVER + that.activity[0].activityImageContent;
                            }else{
                                that.activity[0].activityImageContent = "static/src/activity-default.png";
                            }

                            if(that.activity[0].activityStatus == "registration"){
                                that.activity[0].btnName = "报名中";
                            }else if(that.activity[0].activityStatus == "registrationend"){
                                that.activity[0].btnName = "进行中";
                            }else if(that.activity[0].activityStatus == "end"){
                                that.activity[0].btnName = "已结束";
                            }
                        }

                        that.product = result.data.product;
                    }
                });
            },
            goList: function(name){
                this.$route.router.go({ name: name });
            }
        },
        created:function(){
            var that = this;

            //设置返回键
            this.$root.$children[0].showgoback = false;
            this.$root.$children[1].showfooter = true;
            this.$root.bodyColor='gray';
        },
        ready:function(){
            this.getBanner();
            this.getRecommend();
        }
    });
    module.exports = index;
});

