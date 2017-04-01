/**
 * Created by hmc on 2016/7/7
 */
// 帮助中心

define(function (require, exports, module) {
    require("views/news/src/css.css");
    var sTpl = require("views/news/detail.html");
    var iPublic = require("components/public.js");
    var API_GET = iPublic.API_GET;

    var index = Vue.extend({
		template: sTpl,
        // 列表
        components: {

        },
        data:function(){
            return {
                id: this.$route.params.id,
                detail: [],
                comment: [],
                persion: {},
                superId: null
            }
        },
        methods:{
            getDetail:function(){// 获取详细信息 登录
                var that = this, data = {articleId: that.id},
                    url = "wd_api/article/getArticleDetailsOn",   // 未登录获取资讯详情
                    persion = JSON.parse(sessionStorage.getItem("persion"));

                that.persion = persion;

                if(iPublic.isLogin()){  // 登录之后
                    data.memberId = persion.memberId;
                    url = "wd_api/article/getArticleDetails"; // 登录之后获取资讯详情
                }

                API_GET({
                    url: url,
                    data: data,
                    success: function (result) {
                        console.log(result);
                        that.detail = result.data;
                        that.getSuperId();
                    }
                });
            },
            getSuperId: function(){
                var that = this, data = {
                    memberId: that.superId
                };

                if(iPublic.isLogin()){
                    data.memberId = that.persion.memberId;
                }

                API_GET({
                    url: "wd_api/member/memberShareLinkOn",
                    data: data,
                    success: function(result){
                        that.superId = result.data.recommendId;
                        that.share();
                    }
                });
            },
            share: function(){
                var url = location.href;

                url = url.split("?")[0] + "?recommendCode=" + this.superId + "&source=news";

                //数据加载完加载分享内容
                var shareData={
                    title: "[百万理财师]" + this.detail.articleTitle,
                    desc: this.detail.articleTitle,
                    link: url,
                    imgUrl: iPublic.publicArr.IMG_SERVER + this.detail.coverUrl
                };
                
                iPublic.share(shareData)
            },
            getQueryString: function(name){
                var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
                var r = null;

                if(window.location.href.split("?").length > 1){
                    r = window.location.href.split("?")[1].match(reg);
                }

                if(r != null){
                    return  unescape(r[2]);
                }else{
                    return null;
                }
            }
        },
        created:function(){
            var that = this;

            //设置返回键
            this.$root.$children[0].showgoback = true;
            this.$root.$children[1].showfooter = false;
            this.$root.bodyColor='noOver';

            //设置title
            this.$root.setTitle('详情');
        },
        ready:function(){
            this.getDetail();

            var recommendCode = this.getQueryString("recommendCode"),
                source = this.getQueryString("source");

            if(recommendCode){
                sessionStorage.setItem("recommendCode", recommendCode);
            }
            if(source){
                sessionStorage.setItem("source", source);
            }
        },
        route: {
            //微信分享  当有from参数时 微信分享报签名错误，而直接访问路径时分享没问题  因为只有一个分享页面 然后把分享页面做一次重定向
            activate: function (transition) {
                if(location.search.indexOf("singlemessage")>-1){
                    window.location=location.origin+"/"+location.hash
                }else{
                    transition.next()
                }
            }
        }
    });
    module.exports = index;
});

